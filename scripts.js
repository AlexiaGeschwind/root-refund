//seleciona os elementos do funcionario
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const expenseList = document.querySelector("ul")

//seleciona elementos de totais
const expenseQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

//captura do evente e formatar o valor
amount.oninput = () => {
    //capturando o valor atual do input e remove caracters
    let value = amount.value.replace(/\D/g, "")
    // console.log(value)

    //transforme o valor emcentavos (Ex: 150/100 = 1,5)
    value = Number(value) / 100

    //retorno para a variavel
    amount.value = formatCurrencyBRL(value)

}

//formata valor da moeda brasileira 
function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    return value
}
//captura o evento do submit do from e  obtem os valores
form.onsubmit = (Event) => {
    //previne comportamento de att automatica 
    Event.preventDefault()

    //cria um objeto com os detalhes da nova despesa 
    const newExpense ={
        id: new Date().getTime(),
        expense:expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    }
    
   ExpenseAdd(newExpense)
}
    // adição de itens na lista
    function ExpenseAdd(newExpense) {

        try {
        // cria o elemento para add na lista 
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        //criando o icone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src",`img/${newExpense.category_id}.svg`)

        expenseIcon.setAttribute("alt",newExpense.category_name)

        //criando a info da despesa 
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        //criando o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        //criando a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        //adiciona nome e categoria na div, antes do item
        expenseInfo.append(expenseName, expenseCategory)

        //add o valor
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.replace("R$", "")}`

        //add oicone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src","img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        //add info no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        //add os itens na lista
        expenseList.append(expenseItem)

        //chama aatualizaçao de totais
        updateTotals()

        //limpa o form
        formclear() 

    }catch (error){
        alert("Não foi possivel atualizar a lista de despesas")
        console.log(error)
    }  
}

function updateTotals(){
    try{
        // recuperar todos os itens (li) da lista (ul)
        const items = expenseList.children
        // console.log(items)

        //att a quantidade de itens na lista 
        expenseQuantity.textContent = `${items.length} ${items.length > 1 ?"despesas" : "despesa"}`

        //variavel para incrementaro total
        let total = 0

        // percorrer cada item (li)
        for(let item = 0; item < items.length; item++){
            // percorre cadaitem (li) e busca soemente a classe .expense-am
            const itemAmount = items[item].querySelector(".expense-amount")
            //  console.log(itemAmount)

            //agora vamos pegar somente ovalor 
            const value = itemAmount.textContent.replace(/[^\d,]/g,"").replace(",",".")
           
            // converter o valor para float
            const valueFormatted = parseFloat(value)
            

            //verificar se realmente é um número
            if(isNaN(valueFormatted)) {
                return alert ('Não foi possivel calcular o total. O valor não parece ser um número.')
            }

            //incrementar o valor total
            total += valueFormatted // total = total + valueFormatted
        }

      // expenseTotal.textContent = total
    //    expenseAmount.innerHTML = `<small>R$</small> ${string(total).replace("R$", "")}`

     const symbolBRL = document.createElement("small")
     symbolBRL.textContent = "R$"

    total = formatCurrencyBRL(total).replace("R$","")
    expenseTotal.innerHTML ="<small>R$</small>"
    expenseTotal.append(total)

    }catch(error){
        console.log(error)
        alert('Não foi possivel atualizar os valores')
    }
}

expenseList.addEventListener("click",function(event){
    // console.log(event)

    if(event.target.classList.contains("remove-icon")) {
        // obter a lista pai do elemento clicando
        const item = event.target.closest(".expense")
        item.remove()

    }

    updateTotals()
})

function formclear(){
    expense.value = ""
    category.value = ""
    amount.value = ""

    expense.focus()
}