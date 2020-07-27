const currentPage = location.pathname
const menuItem = document.querySelectorAll("header .links a")

for (item of menuItem){
    if(currentPage.includes(item.getAttribute("href"))){
        item.classList.add("active")
    }
}

/* PAGINAÇÂO */
function pagination(selectedPage, totalPages){
    
    let 
        pages = [],
        oldPage

for(let currentPage = 1; currentPage <= totalPages; currentPage++){

    const firstAndLastPage = currentPage == 1 || currentPage == totalPages
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 1

    if(firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage){

        if(oldPage && currentPage - oldPage > 2){
            pages.push("...")
        }

        if (oldPage && currentPage - oldPage == 2){
            pages.push(oldPage + 1)
        }

        pages.push(currentPage)
        
        oldPage = currentPage
    }
}
    return pages
}