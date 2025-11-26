import { Locator, Page } from "@playwright/test";
import { ElementUtil } from "../ElementUtils/ElementUtil.js";
import { SearchResultsPage } from "./SRP.js";

export class HomePage {
    readonly page:Page;
    private readonly eleUtil:ElementUtil;
    private readonly edtAccountLink:Locator;
    private readonly searchBar:Locator;
    private readonly searchIcon:Locator;

    constructor(page:Page) {
        this.page=page;
        this.eleUtil=new ElementUtil(page);
        this.edtAccountLink=page.getByRole('link', { name: 'Edit Account' });
        this.searchBar=page.locator(`input[placeholder='Search']`);
        this.searchIcon=page.locator('.btn.btn-default.btn-lg');
    }

    async isUserLoggedIn(): Promise<boolean>{
        return this.eleUtil.isVisible(this.edtAccountLink);
    }

    async doSearch(searchKey:string){
        await this.eleUtil.doFill(this.searchBar,searchKey);
        await this.eleUtil.doClick(this.searchIcon);
        return new SearchResultsPage(this.page);
    }
        
}