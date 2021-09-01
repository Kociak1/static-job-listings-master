async function loadData() {
    const src = await fetch('./data.json')
    const result = await src.json()
    return result
}

let data = []
const lists = new Set([])

loadData()
.then(res => {
    data.push(...res)
    data.forEach((element,index) => {
        data[index].filters =  [element.role,element.level, ...element.languages, ...element.tools]
    })
    renderItems()
})


const offfer_tp = document.querySelector("#TPwork")
const filtr_tp = document.querySelector("#tp_filter")
const data_tp = document.querySelector("#tp_data")
const main = document.querySelector("main")
const BOX = document.querySelector(".box")

function renderItems(elements = data) {
    elements.forEach(element => {
        const card = document.importNode(offfer_tp.content, true)
        card.querySelector('img').src = element.logo
        card.querySelector('.new').style.display = (element.new ? "inline" : "none")
        card.querySelector('.featured').style.display = (element.featured ? "inline" : "none")
        card.querySelector('.border').style.display = (element.featured ? "block" : "none")
        card.querySelector('.job_name').textContent = element.company
        card.querySelector('.job_desc').textContent = element.position
        const {postedAt,contract,location} = element
        card.querySelector('.others').textContent = `${postedAt} • ${contract}  • ${location}`
        const cardGrid = card.querySelector('.grid')
        rendercategories(element, cardGrid)
        main.appendChild(card)
    })
}


function rendercategories(element, Grid) {
const categories = [element.role,element.level, ...element.languages, ...element.tools]
categories.forEach(category => {
    
    const catEL = document.importNode(data_tp.content, true)
    catEL.querySelector('.name').textContent = category
    catEL.querySelector('.data_btn').addEventListener('click',() => {
        lists.add(category)
        clearAll()
        filterdata()
        renderFilters()
        BOX.style.display='flex'
    })
    Grid.appendChild(catEL)

})
}

function filterdata() {
    const txt = [...lists]
                .map(el =>  `^${el}$`)
                .join('|')
    const regE = new RegExp(txt,"gi")

    elements = data.filter(ele => {
        const el = ele.filters
        for(prop in el) {
            const wynik = el[prop]
            if(regE.test(wynik)) return true
        }
    })
    renderItems(elements)
}

function clearAll() {
    while(main.firstChild) {
        main.removeChild(main.firstChild)
    }
    while(box.firstChild) {
        box.removeChild(box.firstChild)
    }
}

const box = document.querySelector('.box .btn_grid')
function  renderFilters() {
    [...lists].forEach(element => {
        const boxEl = document.importNode(filtr_tp.content, true)
        boxEl.querySelector('.name').textContent = element
        boxEl.querySelector('.data_btn').addEventListener('click', () => {
            lists.delete(element)
            clearAll()
            filterdata()
            renderFilters()
            if(lists.size == 0) BOX.style.display='none'
        })
        box.appendChild(boxEl)
    })
}
const Clean = document.querySelector('.clear')

Clean.addEventListener('click', () => {
    lists.clear()
    clearAll()
    filterdata()
    renderFilters()
    BOX.style.display='none'
})