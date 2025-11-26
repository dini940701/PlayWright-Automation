import { test,expect } from "../Fixtures/baseFixtures.js";

let search=[
    {searchkey:'macbook',resultcount:3},
    {searchkey:'Samsung',resultcount:2}
]

for(let productSearch of search){
test(`Verify the product search : ${productSearch.searchkey}`,
    {tag:['@regression']},
    async({homePage})=>{
    let srp=await homePage.doSearch(productSearch.searchkey);
    expect(await srp.searchResultsCount()).toBe(productSearch.resultcount);
});
}
