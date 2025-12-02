import {test,expect} from '../Fixtures/baseFixtures.js';
import { LoginPage } from '../Pages/LoginPage.js';


test('Verify login to an application with valid credentials @sanity',
    {annotation:[
        {type:'epic',description:'Login'},
        {type:'story',description:'Login to an application'}
    ]
    }
    ,async({homePage})=>{
    await expect(homePage.page).toHaveTitle('My Account');
});

test('Verify the error message for invalid login credentials',async({page,baseURL})=>{
    const loginPage=new LoginPage(page);
    await loginPage.goto(baseURL);
    await loginPage.doLogin('diddne3sdh23@mail.com','1@Dnsde3cdsh');
    const errorMessage=await loginPage.invalidLogin();
    expect(errorMessage).toContain('Warning: No match for E-Mail Address and/or Password.');
});