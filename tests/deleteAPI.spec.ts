import { test,expect } from '@playwright/test';

const TOKEN='7751546808c6e572320994d59f37be8701b1402108d17e613a06b1209cf41c90';

test.skip('Delete-user details',async({request})=>{
    const response=await request.delete('https://gorest.co.in/public/v2/users/8281869',{
        headers:{
            Authorization:`Bearer ${TOKEN}`
        }
    });
    expect(response.status()).toBe(204);
    const data=await response.json();
    console.log(data);
});