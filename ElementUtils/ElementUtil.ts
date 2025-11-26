import { Locator, Page } from "@playwright/test";

type flexibleLocator=string|Locator;
export class ElementUtil {
    private page:Page;
    private defaultTimeout:number=30000;

    constructor(page:Page,timeout:number=30000) {
        this.page=page,
        this.defaultTimeout=timeout
    }
/**
 * To get locator using locator and optional index
 * @param locator 
 * @param index 
 * @returns 
 */
    private getLocator(locator:flexibleLocator,index?:number):Locator{
        if(typeof locator==='string'){
            if(index){
                return this.page.locator(locator).nth(index)
            }
            else{
                return this.page.locator(locator).first()
            }
        }
        else{
            if(index){
                return locator.nth(index);
            }
            else{
                return locator.first();
            }
        }
    }
    
/**
 * To fill an value into an locator using fill()
 * @param locator 
 * @param value 
 */
    async doFill(locator:flexibleLocator,value:string,index?:number):Promise<void>{
        await this.getLocator(locator).fill(value);
        console.log(`Value filled into an ${locator} is ${value}`);
    }


    async doClick(locator:flexibleLocator,index?:number,options?:{force?:boolean,timeout?:number}){
        await this.getLocator(locator).click({
            force:options?.force,
            timeout:options?.timeout || this.defaultTimeout
        })
    }


    async pressSequentially(locator:flexibleLocator,value:string,delay:number=300):Promise<void>{
        await this.getLocator(locator).pressSequentially(value,{
            delay:delay,
            timeout:this.defaultTimeout
        });
        console.log(`Fill value into an element in sequential manner`);
    }


    async rightClick(locator:flexibleLocator){
        await this.getLocator(locator).click({
            button:'right',
            timeout:this.defaultTimeout
        });
    }

    async doubleClick(locator:flexibleLocator){
        await this.getLocator(locator).dblclick({timeout:this.defaultTimeout});
    }
/**
 * selectByValueDropdown
 * @param locator 
 * @param value 
 */
    async selectByValueDropdown(locator:flexibleLocator, value:string){
        await this.getLocator(locator).selectOption(value);
    }

/**
 * selectByLabelDropdown
 * @param locator 
 * @param value 
 */
    async selectByLabelDropdown(locator:flexibleLocator, labelValue:string){
        await this.getLocator(locator).selectOption({label:labelValue});
    }

/**
 * selectByIndexDropdown
 * @param locator 
 * @param value 
 */
    async selectByIndexDropdown(locator:flexibleLocator, indexValue:number){
        await this.getLocator(locator).selectOption({index:indexValue});
    }

/**
 * Get text using text content
 * @param locator 
 */
async getText(locator:flexibleLocator):Promise<string | null>{
        const text=await this.getLocator(locator).textContent();
        return text;
    }

/**
 * Get text using innerText
 * @param locator 
 * @returns 
 */
async getInnerText(locator:flexibleLocator):Promise<string>{
    const innerText=await this.getLocator(locator).innerText();
    return innerText;
}

/**
 * Checkbox is checked
 * @param locator
 */
    async isChecked(locator:flexibleLocator){
        return this.getLocator(locator).isChecked();
    }

    async isVisible(locator:flexibleLocator){
        return this.getLocator(locator).isVisible();
    }

   async isEnabled(locator:flexibleLocator){
        return this.getLocator(locator).isEnabled();
    } 

    async isDisabled(locator:flexibleLocator){
        return this.getLocator(locator).isDisabled();
    } 

    async isEditable(locator:flexibleLocator){
        return this.getLocator(locator).isEditable();
    } 

    async isHidden(locator:flexibleLocator){
        return this.getLocator(locator).isHidden();
    }

    async waitForVisible(locator:flexibleLocator){
        try{
            await this.getLocator(locator).waitFor({state:'visible',timeout:this.defaultTimeout});
            return true;
    }
    catch{
        return false;
    }
}
/**
 * waitForLoadState
 * @param locator 
 * @param state 
 */
    async waitForLoadState(locator:flexibleLocator,state: "load" | "domcontentloaded" | "networkidle"='load'){
        await this.page.waitForLoadState(state);
    }
}