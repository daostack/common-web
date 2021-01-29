// import * as admin from 'firebase-admin';
//
// const update = jest.fn();
//
// const doc = jest.fn(() => ({ update }));
// const init = jest.spyOn(admin, 'firestore').mockReturnValue({
//   collection: jest.fn()
// });
//
// const collection = jest.spyOn(admin.firestore(), 'collection').mockReturnValue((({ doc } as unknown) as any));
// //
// // jest.mock('firebase-admin', () => ({
// //   firestore: jest.fn()
// //     .mockReturnValue({})
// // }));