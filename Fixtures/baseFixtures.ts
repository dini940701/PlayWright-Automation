import { test as base,expect } from '@playwright/test';
import { HomePage } from '../Pages/HomePage.js';
import { LoginPage } from '../Pages/LoginPage.js';

type myFixture={
    homePage:HomePage;
}
export const test=base.extend<myFixture>({
    homePage:async ({page,baseURL},use,testInfo)=>{
        const loginPage=new LoginPage(page);
        await loginPage.goto(baseURL);
        const userName=await testInfo.project.metadata.appUserName;
        const password=await testInfo.project.metadata.appPassword;
        const homePage=await loginPage.doLogin(userName,password);
        expect(await homePage.isUserLoggedIn()).toBeTruthy();
        await use(homePage);
    }
});

export{expect};