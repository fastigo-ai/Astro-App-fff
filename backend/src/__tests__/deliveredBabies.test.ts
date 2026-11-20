import { adminService } from '../modules/admin/admin.service';
import { adminController } from '../modules/admin/admin.controller';
import { DeliveredBabiesCollection } from '../shared/db/dbStore';

async function runTests() {
  console.log('🧪 Starting Delivered Babies Showcase & Admin Upload Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Get seeded delivered babies
    const list = adminService.getDeliveredBabies();
    assert(Array.isArray(list) && list.length >= 5, 'adminService.getDeliveredBabies returns seeded showcases');
    assert(Boolean(list[0].babyName && list[0].parentsName && list[0].imageUrl), 'Delivered baby record contains name, parents & image');

    // 2. Create a new delivered baby
    const newBaby = await adminService.createDeliveredBaby({
      babyName: 'Baby Shlok',
      parentsName: 'Ananya & Vikram Rathore',
      city: 'Udaipur, Rajasthan',
      imageUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0c?w=600',
      deliveryDate: 'Delivered 19 Nov 2026',
      deliveryType: 'Normal Delivery',
      gender: 'boy',
      weight: '3.5 kg',
      testimonial: 'The divine Vedic mantras made our delivery peaceful and smooth!',
    });

    assert(Boolean(newBaby && newBaby.id.startsWith('baby_')), 'adminService.createDeliveredBaby generates baby ID');
    assert(newBaby.babyName === 'Baby Shlok', 'Created baby has correct babyName');

    // 3. Verify in collection
    const updatedList = adminService.getDeliveredBabies();
    const found = updatedList.find(b => b.id === newBaby.id);
    assert(Boolean(found), 'Newly created delivered baby is present in collection');

    // 4. Test Controller create validation
    let resStatus = 0;
    let resData: any = null;
    const mockRes: any = {
      status(code: number) {
        resStatus = code;
        return this;
      },
      json(data: any) {
        resData = data;
        return this;
      },
    };

    const mockReqMissing: any = {
      body: { babyName: 'Incomplete Baby' },
    };
    await adminController.createDeliveredBaby(mockReqMissing, mockRes);
    assert(resStatus === 400 && resData.success === false, 'adminController rejects incomplete baby payload with 400');

    // 5. Delete baby
    const deleted = await adminService.deleteDeliveredBaby(newBaby.id);
    assert(deleted === true, 'adminService.deleteDeliveredBaby deletes baby record successfully');

    const finalList = adminService.getDeliveredBabies();
    assert(!finalList.some(b => b.id === newBaby.id), 'Deleted baby is removed from collection');
  } catch (err: any) {
    console.error('Unexpected test exception:', err);
    failed++;
  }

  console.log('\n========================================');
  console.log(`🏁 Delivered Babies Tests Completed: ${passed} Passed, ${failed} Failed`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
