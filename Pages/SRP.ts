import { Locator, Page } from '@playwright/test';
import { ElementUtil } from '../ElementUtils/ElementUtil.js';
import { ProductDetailsPage } from './PDP.js';


export class SearchResultsPage {
    private readonly page:Page;
    private readonly eleUtil:ElementUtil;
    private readonly resultCount:Locator;
    
    constructor(page:Page) {
        this.page=page;
        this.eleUtil=new ElementUtil(page);
        this.resultCount=page.locator('.product-thumb');
    }

    async searchResultsCount():Promise<number>{
        return await this.resultCount.count();
    }

    async selectProduct(productName:string):Promise<ProductDetailsPage>{
        await this.eleUtil.doClick(this.page.getByRole('link', { name: `${productName}` }));
        return new ProductDetailsPage(this.page);
    }
        
}