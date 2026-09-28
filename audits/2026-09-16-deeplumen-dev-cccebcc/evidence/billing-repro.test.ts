// Authorized defensive audit. Synthetic fixtures only; all I/O is mocked.
// These passing assertions reproduce observed defects, not compliance acceptance tests.
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from './repo/apps/shopify-app/node_modules/@prisma/client';
const mocks = vi.hoisted(() => ({
  query: vi.fn(), transaction: vi.fn(), refundEvents: vi.fn(),
  facts: vi.fn(), version: vi.fn(), catalog: vi.fn(), commit: vi.fn(), fx: vi.fn(),
}));
vi.mock('./repo/apps/shopify-app/app/db.server', () => ({ default: {
  $queryRaw: mocks.query, $transaction: mocks.transaction,
  cpsOrderEvent: {findMany: mocks.refundEvents},
}}));
vi.mock('./repo/apps/shopify-app/app/lib/fx/snapshot-store.server', () => ({fxRateReader:{readRate:mocks.fx}}));
vi.mock('./repo/apps/shopify-app/app/lib/cps/category-catalog.server', () => ({resolveCategoryCatalog:mocks.catalog}));
vi.mock('./repo/apps/shopify-app/app/lib/cps/pricing-rate-version.server', async (importOriginal) => ({
  ...await importOriginal<typeof import('./repo/apps/shopify-app/app/lib/cps/pricing-rate-version.server')>(),
  resolveRateVersion:mocks.version,
}));
vi.mock('./repo/apps/shopify-app/app/lib/cps/economics/order-facts.server', () => ({
  readCompleteOrderFacts:mocks.facts,
  CPS_PRICING_FACTS_REASON:{REFUND_MIXED_FUNDS_UNALLOCATABLE:'REFUND_MIXED_FUNDS_UNALLOCATABLE'},
}));
vi.mock('./repo/apps/shopify-app/app/lib/cps/economics/order-recalculator.server', () => ({commitRecalculation:mocks.commit}));
vi.mock('./repo/apps/shopify-app/app/lib/cps/shopify-budget/budgeted-admin.server', () => ({
  withCpsShopifyBudget:(admin:unknown)=>admin,
  CpsShopifyBudgetDeniedError:class extends Error {},
}));
import { runCategoryPricingRecalc } from './repo/apps/shopify-app/app/lib/cps/economics/recalc-orchestrator.server';
import { planFeatures } from './repo/apps/shopify-app/app/mocks/plan';
import { deriveCpsPromotionAllowance } from './repo/apps/shopify-app/app/lib/cps/promotion-allowance';

const d=(s:string)=>new Prisma.Decimal(s);
const at=new Date('2026-09-16T00:00:00Z');
const category='gid://shopify/TaxonomyCategory/new-category';
const fixtureLine={lineOrdinal:0,lineItemGid:'gid://shopify/LineItem/1',productGid:'gid://shopify/Product/1',variantGid:null,
  productResolutionStatus:'RESOLVED',classificationStatus:'RESOLVED',orderedQuantity:1,quantity:1,isGiftCard:false,
  categoryId:category,categoryFullName:'New category',ancestorIds:[],categoryReadAt:at,
  discountedTotalShop:d('100'),refundedSubtotalShop:d('0'),lineAmountShop:d('100'),currency:'USD',
  discountEvidence:{originalTotalShop:'100',discountedTotalShop:'100',allocations:[]}};
const facts={orderId:'gid://shopify/Order/1',orderCreatedAt:at,orderUpdatedAt:at,currency:'USD',presentmentCurrency:'USD',taxesIncluded:false,
  currentTotalPriceShop:d('110'),publicAmountShop:d('10'),publicAmountEvidence:{currentSubtotalShop:'100',currentTotalTaxShop:'0',currentShippingShop:'10',totalTipReceivedShop:'0',currentTotalDutiesShop:null},
  lines:[fixtureLine],factsFingerprint:'b'.repeat(64),checkedAt:at};
const order={id:'order-1',factsFingerprint:'a'.repeat(64),shopId:'synthetic',shopDomain:'synthetic.myshopify.com',
  billingAccountId:'gid://shopify/Shop/1',shopifyOrderId:'gid://shopify/Order/1',orderKeyHash:'c'.repeat(64),
  targetRevision:1,currentPricingRevision:1,policyMode:'CATEGORY_ACTIVE',approvedCatalogVersion:'catalog-1',
  frozenFxRate:d('1'),frozenFxSource:'synthetic',frozenFxFetchedAt:at};
const lease={id:'work-1',billingAccountId:order.billingAccountId,payload:{orderGid:order.shopifyOrderId},resourceId:order.shopifyOrderId};

beforeEach(()=>{
  vi.clearAllMocks();
  mocks.query.mockResolvedValue([order]);
  mocks.refundEvents.mockResolvedValue([]);
  mocks.transaction.mockImplementation(async (fn:(tx:unknown)=>unknown)=>fn({}));
  mocks.facts.mockResolvedValue({status:'COMPLETE',facts});
  mocks.version.mockResolvedValue({id:'rate-1',rates:{category_new:'0.15',uncategorized:'0.15',public_rate_policy:{mode:'LOWEST_POSITIVE_RATE'},algorithm_version:'v1'}});
  mocks.catalog.mockResolvedValue({version:'catalog-1',mappings:{[category]:'category_new'}});
  mocks.commit.mockResolvedValue({status:'COMMITTED',phase:'PHASE_TWO'});
});
describe('BFS audit synthetic defect reproductions',()=>{
  it('recalculates submitted order at current category 15% without reading frozen 10% terms',async()=>{
    // A historical 10% rate and public rate would mean $11.00; current product category is 15%.
    await runCategoryPricingRecalc(lease as never,{createAdmin:async()=>({graphql:vi.fn()})} as never,at);
    const input=mocks.commit.mock.calls[0][1].snapshotInput;
    expect(input.targetAmountUsd.toString()).toBe('16.5');
    expect(input.publicRateBasis).toBe('SELECTED');
    expect(input.publicRateInheritedFromSnapshotId).toBeNull();
    expect(mocks.query).toHaveBeenCalledTimes(1);
  });
  it.each(['AI_REFERRAL','EXCLUSIVE_CONTRACT'])('overwrites %s source with AP_CATEGORY',async(source)=>{
    mocks.query.mockResolvedValue([{...order,attributionType:source==='AI_REFERRAL'?'AI_REFERRAL':'AP_UTM',rateOrigin:source==='EXCLUSIVE_CONTRACT'?'CONTRACT':'STANDARD',pricingSource:source,cpsRate:d('0.05')}]);
    await runCategoryPricingRecalc(lease as never,{createAdmin:async()=>({graphql:vi.fn()})} as never,at);
    const input=mocks.commit.mock.calls[0][1].snapshotInput;
    expect(input.pricingSource).toBe('AP_CATEGORY');
    expect(input.targetAmountUsd.toString()).toBe('16.5');
  });
  it('advertises a free-order entitlement even when it never applied to the shop',()=>{
    const allowance=deriveCpsPromotionAllowance({shop:{cpsPromotionEnabled:false,cpsPromotionQuotaConfig:3,cpsPromotionQuotaFrozen:null,cpsPromotionUsedCount:0},policy:null});
    expect(allowance.applies).toBe(false);
    expect(planFeatures({agenticRatePct:10,promotionQuotaTotal:allowance.quotaTotal})).toContain('First 3 attributed orders free');
  });
});
