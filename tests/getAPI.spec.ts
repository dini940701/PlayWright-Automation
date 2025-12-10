import { test,expect } from '@playwright/test';

const TOKEN='7751546808c6e572320994d59f37be8701b1402108d17e613a06b1209cf41c90';

test('Get-ALL user details',async({request})=>{
    const response=await request.get('https://gorest.co.in/public/v2/users',{
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    });
    expect(response.status()).toBe(200);
    const data=await response.json();
    console.log(data);
});


test('Get-Single user details',async({request})=>{
    const response=await request.get('https://gorest.co.in/public/v2/users/8282373',{
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    });
    expect(response.status()).toBe(200);
    const data=await response.json();
    console.log(data);
});