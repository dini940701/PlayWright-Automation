import { test,expect } from '@playwright/test';

const TOKEN='7751546808c6e572320994d59f37be8701b1402108d17e613a06b1209cf41c90';

test('Post-Create a new user',async ({request})=>{
    const requestBody={
    'name': 'Dini003',
    'email': `dini005${Date.now()}@mail.com`,
    'gender': 'male',
    'status': 'inactive'
    };
    const respone=await request.post('https://gorest.co.in/public/v2/users',{
        headers:{
            Authorization:`Bearer ${TOKEN}`
        },
        data:requestBody
    });
    expect(respone.status()).toBe(201);
    const data=await respone.json();
    console.log(data);
});
