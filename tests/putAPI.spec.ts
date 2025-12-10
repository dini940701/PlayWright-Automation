import { test,expect } from '@playwright/test';

const TOKEN='7751546808c6e572320994d59f37be8701b1402108d17e613a06b1209cf41c90';

test.skip('PUT-update the user details',async({request})=>{
    const requestBody={
            status:'inActive'
        };
    const respone=await request.put('https://gorest.co.in/public/v2/users/8281869',{
        headers:{
            Authorization:`Bearer ${TOKEN}`
        },
        data:requestBody
    });
    expect(respone.status()).toBe(200);
    const data=await respone.json();
    console.log(data);
});