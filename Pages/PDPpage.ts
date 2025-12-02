import { Locator, Page } from '@playwright/test';
import { ElementUtil } from '../ElementUtils/ElementUtil';

export class ProductDetailsPage {
    private readonly page:Page;
    private readonly eleUtil:ElementUtil;
    private readonly header:Locator;
    private readonly imageCount:Locator;
    private readonly productMetaData:Locator;
    private readonly productPricingData:Locator;
    private readonly productMap=new Map<string,string|number|null>;

    constructor(page:Page) {
        this.page=page;
        this.eleUtil=new ElementUtil(page);
        this.header=page.locator('h1');
        this.imageCount=page.locator('div#content img');
        this.productMetaData=page.locator('(//div[@id=\'content\']//ul[@class=\'list-unstyled\'])[1]/li');
        this.productPricingData=page.locator('(//div[@id=\'content\']//ul[@class=\'list-unstyled\'])[2]/li');

    }

    async getProductHeader(){
        return await this.eleUtil.getInnerText(this.header);
    }

    async getImageCount(){
        const imageCount=await this.imageCount.count();
        console.log(`No.of product images for the product ${this.header} : ${imageCount}`);
        return imageCount;
    }

    private async getProductMetaData(){
        const metaData=await this.productMetaData.allInnerTexts();
        for(const productInfo of metaData){
            const info=productInfo.split(':');
            const metaKey=info[0].trim();
            const metaValue=info[1].trim();
            this.productMap.set(metaKey, metaValue);
        }
    }
    private async getProductPricingData(){
        const productPricing=await this.productPricingData.allInnerTexts();
        const pricingData=productPricing[0].trim();
        const exTaxPrice=productPricing[1].split(':')[1].trim();
        this.productMap.set('productprice',pricingData);
        this.productMap.set('extaxprice',exTaxPrice);
    }
}