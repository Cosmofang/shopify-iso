// Authorized defensive reproduction against a disposable synthetic PostgreSQL schema only.
import {createHash} from 'node:crypto';
import {afterAll,expect,it,vi} from 'vitest';
import {Prisma,PrismaClient} from './repo/apps/shopify-app/node_modules/@prisma/client';
import {syncCpsAuthorization,changeCpsRollout} from './repo/apps/shopify-app/app/lib/cps/enrollment.server';
import {releaseDueCpsOrders} from './repo/apps/shopify-app/app/lib/cps/obligation.server';
import {upsertWorkItem} from './repo/apps/shopify-app/app/lib/cps/work-items/upsert.server';
import {publishRateVersion} from './repo/apps/shopify-app/app/lib/cps/pricing-rate-version.server';

const db=new PrismaClient();
const now=new Date('2026-09-16T00:00:00Z');
const start=new Date('2026-09-01T00:00:00Z');
const end=new Date('2026-10-01T00:00:00Z');
const domain='bfs-synthetic-release.myshopify.com';
const shopGid='gid://shopify/Shop/991827361';
afterAll(async()=>{await db.$disconnect();});
it('B-03: category pricing MANUAL_REVIEW still permits a real pending billing obligation',async()=>{
  if(!process.env.CPS_TEST_SCHEMA) throw new Error('Disposable CPS_TEST_SCHEMA required');
  const url=new URL(process.env.DATABASE_URL!);
  if(url.hostname!=='127.0.0.1'||url.port!=='65432'||url.pathname!=='/bfs_billing_repro')throw new Error('Only approved synthetic database allowed');
  await db.cpsPolicy.update({where:{id:'global'},data:{mode:'HANDOFF_PENDING',newStorePromotionEnabled:false,newStorePromotionQuota:null,updatedBy:'bfs-audit'}});
  await db.shop.create({data:{id:'bfs-synthetic-shop',domain}});
  await syncCpsAuthorization(domain,{graphql:vi.fn(async()=>new Response(JSON.stringify({data:{shop:{id:shopGid}}}),{headers:{'content-type':'application/json'}}))} as never,{
    checkedAt:now,readActiveSubscription:async()=>({shop:{id:shopGid},billingPeriod:'EVERY_30_DAYS',cancelAtEndOfCycle:false,trialEndsAt:null,currentBillingCycle:{startTime:start.toISOString(),endTime:end.toISOString()},items:[{handle:'ap-commission-cf',description:'Synthetic CPS',price:{__typename:'TieredPrice',active:true,currency:'USD',tiersMode:'VOLUME',tiers:[{upTo:null,amountPerUnit:'1.0',amount:'0.0'}]}}]})
  });
  await changeCpsRollout({kind:'SET_GLOBAL_MODE',mode:'CATEGORY_ACTIVE'},{type:'system',id:'bfs-audit'},now);
  const shop=await db.shop.findUniqueOrThrow({where:{domain}});
  const orderGid='gid://shopify/Order/991827361';
  await db.orderSyncState.create({data:{shop:domain,watermark:now}});
  const order=await db.cpsOrder.create({data:{
    billingAccountId:shop.cpsBillingAccountId!,shopId:shop.id,shopifyOrderId:orderGid,
    orderKeyHash:createHash('sha256').update('bfs-synthetic-release').digest('hex'),
    lastOrderSourceUpdatedAt:now,sourceFactsStatus:'COMPLETE',sourceFactsCheckedAt:now,
    factsFingerprint:'a'.repeat(64),paymentEvidenceFingerprint:'a'.repeat(64),nextEvaluationAt:now,
    qualificationStatus:'QUALIFIED',qualificationReason:'QUALIFIED',qualificationDecisionAt:now,
    firstFullyPaidAt:new Date('2026-09-08T00:00:00Z'),paidWebhookId:'bfs-synthetic-paid',qualifiedAt:new Date('2026-09-08T00:00:00Z'),qualificationRecordedAt:new Date('2026-09-08T00:00:00Z'),
    attributionType:'AP_UTM',attributionEvidenceVersion:'cps-attribution-v1',qualificationEvidence:{schemaVersion:'cps-qualification-evidence-v1'},
    installationIdAtQualification:shop.cpsCurrentInstallationId!,agreementIdAtQualification:shop.cpsCurrentAgreementId!,qualificationCycleStart:start,qualificationCycleEnd:end,
    originalBillableAmountShop:new Prisma.Decimal('100'),currentSettledNetShop:new Prisma.Decimal('100'),shopCurrency:'USD',cpsRate:new Prisma.Decimal('0.1'),rateOrigin:'STANDARD',
    fxRate:new Prisma.Decimal('1'),fxSource:'fixed:USD',fxFetchedAt:now,approvedCatalogVersion:'fixed:USD',planVersion:'synthetic-plan',planEffectiveAt:start,approvalCopyVersion:'cps-pricing-v8',holdPeriodDays:7,holdUntil:new Date('2026-09-15T00:00:00Z'),isShadow:false,cpsChargeStartsAt:start,
    originalCommissionUsd:new Prisma.Decimal('10'),targetAmountUsd:new Prisma.Decimal('10'),targetRevision:1,releaseStatus:'PENDING',pricingStatus:'BLOCKED',
    correlationId:'bfs-synthetic',businessTransactionId:'bfs-synthetic',
  }});
  // A category schedule exists for this order, so absence of a snapshot is not a historical legacy exemption.
  await publishRateVersion(db,{version:'bfs-category-v1',effectiveAt:start,rates:Object.fromEntries([...Array.from({length:26},(_,i)=>[`category_${i}`,'0.15']),['uncategorized','0.15'],['public_rate_policy',{mode:'LOWEST_POSITIVE_RATE'}],['algorithm_version','v1']]),createdBy:'bfs-audit'});
  await db.$transaction(async(tx)=>upsertWorkItem(tx,{billingAccountId:shop.cpsBillingAccountId!,workType:'ORDER_PRICING_RECALC',resourceId:orderGid,idempotencyKey:`order:${orderGid}`,priority:10,payload:{orderGid},now}));
  await db.cpsWorkItem.updateMany({where:{billingAccountId:shop.cpsBillingAccountId!},data:{status:'MANUAL_REVIEW'}});
  const count=await releaseDueCpsOrders(now,10);
  const obligation=await db.cpsBillingLedgerRecord.findFirstOrThrow({where:{cpsOrderId:order.id,recordKind:'PLATFORM_OBLIGATION'}});
  expect(count).toBe(1);
  expect(obligation.amountUsd?.toString()).toBe('10');
  expect(obligation.submissionState).toBe('PENDING');
  expect(obligation.pricingSnapshotId).toBeNull();
  expect((await db.cpsOrder.findUniqueOrThrow({where:{id:order.id}})).pricingStatus).toBe('BLOCKED');
});
