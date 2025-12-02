import { test,expect } from '../Fixtures/baseFixtures.js';

const search=[
    {searchkey:'macbook',resultcount:3},
    {searchkey:'Samsung',resultcount:2}
];

for(const productSearch of search){
test(`Verify the product search : ${productSearch.searchkey}`,
    {tag:['@regression']},
    async({homePage})=>{
    const srp=await homePage.doSearch(productSearch.searchkey);
    expect(await srp.searchResultsCount()).toBe(productSearch.resultcount);
});
}
