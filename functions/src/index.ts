import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

export const newBatchToWarehouse = functions.firestore
.document('warehouse_batch/{newBatch}')
.onCreate(async (snapshot, context) => {
    // Get data from new batch
    const newDataBatch: any = snapshot.data();
    const batch = newDataBatch['batch'];

    for (let product of batch) {
        let qty: number;
        let doc = await db.collection('warehouse').doc(product['id']).get();
        qty = doc.get('qty') + product['qty'];
        await db.collection('warehouse').doc(product['id'])
        .set({'qty': qty}, {merge: true})
    }
})

export const discountProductWarehouse = functions.firestore
.document('warehouse_out/{newOut}')
.onCreate(async (snapshot, context) => {
    // Get data from new out
    const newDataOut: any = snapshot.data();
    const out = newDataOut['out'];

    for (let product of out) {
        let qty: number;
        let doc = await db.collection('warehouse').doc(product['id']).get();
        qty = doc.get('qty') - product['qty'];
        await db.collection('warehouse').doc(product['id'])
        .set({'qty': qty}, {merge: true})
    }
}) 
