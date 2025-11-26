import { Locator, Page } from "@playwright/test";
import { ElementUtil } from "../ElementUtils/ElementUtil.js";


export class ProductDetailsPage {
    private readonly page:Page;
    private readonly eleUtil:ElementUtil;
    private readonly header:Locator;
    private readonly imageCount:Locator;
    private readonly productMetaData:Locator;
    private readonly productPricingDetails:Locator;
    private readonly productMap=new Map<string,string|number|null>;
    
    constructor(page:Page) {
        this.page=page;
        this.eleUtil=new ElementUtil(page);
        this.header=page.locator('h1');
        this.imageCount=page.locator(`//div[@id="content"]//img`);
        this.productMetaData=page.locator(`(//div[@id="content"]//ul[@class="list-unstyled"])[1]/li`);
        this.productPricingDetails=page.locator(`(//div[@id="content"]//ul[@class="list-unstyled"])[2]/li`)
    }

    async getProductHeader(){
        const header=await this.eleUtil.getInnerText(this.header);
        console.log(`Product header is ${header}`);
        return header.trim();
    }

    async getImgCount(){
        const imgCount=await this.imageCount.count();
        console.log(`total number of images for the product ${this.header}:${imgCount}`);
        return imgCount;
    }

    private async getProductMetaData(){
        let metaData=await this.productMetaData.allInnerTexts();
        for(let productInfo of metaData){
            let info=productInfo.split(':');
            let metaKey=info[0].trim();
            let metaValue=info[1].trim();
            this.productMap.set(metaKey,metaValue);
        }
    }

    private async getProductPricing(){
        let pricingData=await this.productPricingDetails.allInnerTexts();
        let productPrice=pricingData[0].trim();
        let exTax=pricingData[1].split(`:`)[1].trim();
        this.productMap.set(`productprice`,productPrice);
        this.productMap.set(`extaxprice`,exTax);
    }

    async getProductInformation(){
        this.productMap.set(`header`,await this.getProductHeader());
        this.productMap.set(`imagecount`, await this.getImgCount());
        await this.getProductMetaData();
        await this.getProductPricing();
        await this.printProductInfo();
        return this.productMap;
    }

    private async printProductInfo(){
        for(const [key,value] of this.productMap){
            console.log(key,value);
        }
    }

}