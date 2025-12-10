// e2e test:
// 1. create a user – post –– 201
// 2. get a user – userid =  –– 200
// 3. update a user –– userid =  –– 200
// 4. delete a user –– userid =  –– 204
// 5. get a user – userid =  –– 404

import { test,expect } from '@playwright/test';

const TOKEN='7751546808c6e572320994d59f37be8701b1402108d17e613a06b1209cf41c90';
const BaseURL='https://gorest.co.in/public/v2/users';
const header={
    'Authorization':`Bearer ${TOKEN}`,
    'Content-Type':'application/json'
};



test('End to End Crud API Testing',async({request})=>{

    //1. Create a User
    console.log('=====POST CALL=====');
    const requestBody={
    name: `Dini${Date.now()}`,
    email: `dini${Date.now()}@mail.com`,
    gender: 'male',
    status: 'inactive'
};
    const postResponse=await request.post(BaseURL,{
        headers:header,
        data:requestBody
    });
    expect(postResponse.status()).toBe(201);
    const data=await postResponse.json();
    console.log(data);
    const userId=data.id;
    console.log('created user id=' + userId);


    //2. Get the Created User
    console.log('=====GET CALL=====');
    const getResponse=await request.get(`${BaseURL}/${userId}`,{
        headers:header
    });
    expect(getResponse.status()).toBe(200);
    const getUserData=await getResponse.json();
    console.log(getUserData);

    //3. Update the user details
    console.log('=====PUT CALL=====');
    const updateData={
        status:'active'
    };
    const putResponse=await request.put(`${BaseURL}/${userId}`,{
        headers:header,
        data:updateData
    });
    expect(putResponse.status()).toBe(200);
    const putUserData=await putResponse.json();
    console.log(putUserData);
    console.log('user is updated successfully');

    //4. Delete the User
    console.log('=====DELETE CALL=====');
    const deleteResponse=await request.delete(`${BaseURL}/${userId}`,{
        headers:header
    });
    expect(deleteResponse.status()).toBe(204);
    console.log('user is deleted successfully');

    //5. Get the created user data
    console.log('=====GET CALL=====');
    const getDeleteResponse=await request.get(`${BaseURL}/${userId}`,{
        headers:header
    });
    expect(getDeleteResponse.status()).toBe(404);
    const getDeletedUserData=await getDeleteResponse.json();
    console.log(getDeletedUserData);
    console.log('user is not found');
});


