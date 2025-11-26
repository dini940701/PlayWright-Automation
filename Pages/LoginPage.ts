import { ElementUtil } from "../ElementUtils/ElementUtil.js";
import { Locator,Page } from "@playwright/test";
import { HomePage } from "./HomePage.js";

export class LoginPage {
    private readonly page:Page;
    private readonly eleUtil:ElementUtil;
    private readonly emailId:Locator;
    private readonly password:Locator;
    private readonly loginButton:Locator;
    private readonly warningMessage:Locator;
    constructor(page:Page) {
        this.page=page;
        this.eleUtil=new ElementUtil(page);
        this.emailId=page.locator(`#input-email`);
        this.password=page.locator(`#input-password`);
        this.loginButton=page.getByRole('button', { name: 'Login' });
        this.warningMessage=page.getByText('Warning: No match for E-Mail Address and/or Password.', { exact: true });
    }

    async goto(baseURL: string | undefined){
        await this.page.goto(`${baseURL}?route=account/login`)
    }

    async doLogin(userName:string,password:string):Promise<HomePage>{
        await this.eleUtil.doFill(this.emailId, userName);
        await this.eleUtil.doFill(this.password,password);
        await this.eleUtil.doClick(this.loginButton);
        return new HomePage(this.page);
    }

    async invalidLogin():Promise<string | null>{
        const errorMessage=await this.eleUtil.getText(this.warningMessage)
        console.log(`Failed Login error message : ${errorMessage}`);
        return errorMessage;
        }

}