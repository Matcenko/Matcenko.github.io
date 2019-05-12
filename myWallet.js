
Wallet = {
    balance : 0,
    Categories : [['salary','side job','presents','interest'], ['products','entertainment','clothes','health']],

    transfer: function (categories,cashFlow) { //прорисовка заполнения поля транзакции

        $('.transaction').empty();

        $(".transaction").html(cashFlow); // Используем cashFlow для заполнения названий транзакций и для назначения классов
        let $inputTransaction = $('<input id="inputTransaction">');
        let $selectCategory = $('<select class="selectCategory"></select>');

        let $saveTransactionButton = $('<button class="saveTransactionButton">Save</button>');
    
        $(".transaction").append($inputTransaction);
        $(".transaction").append($selectCategory);
        $(".transaction").append($saveTransactionButton);
        
        this.addCategoriesToSelect(categories);
    },
    addCategoriesToSelect:function(categories){
        categories.forEach((item)=>{ //добавляем категории товаров в список
            let $option = $(`<option>`);
            $option.html(item)
            $('.selectCategory').append($option);
        })
    },
    saveTransaction:function(cashFlow){ //сохраянем введенную транзакцию/добавление категории
        $('.saveTransactionButton').click( ()=>{ 
            if((inputTransaction.value>0)||(inputTransaction.value<0)){
                let thisSelect = $('.selectCategory');
                let thisTransaction = +inputTransaction.value;
                inputTransaction.value ='';
                if((cashFlow === 'Consumption')&&(thisTransaction>0) //если введена неверная сумма
                || (cashFlow === 'Income')&&(thisTransaction<0))
                    thisTransaction*=(-1);

                Wallet.balance += +thisTransaction; //сохраняем баланс
                $('#balance').html(Wallet.balance); 
                window.localStorage.balance = this.balance;

                $incomeOrConsumption = $(
                `<aside class="border ${cashFlow}">
                    ${cashFlow} transaction:  ${new Date().toDateString()} 
                    <br>
                    ${thisTransaction} &#8372 ${thisSelect.val()}
                </aside>`);
                $('section').append($incomeOrConsumption);

                window.localStorage.transactionList = $('#transactionList').html();
            }
        })
    },
    saveChanges:function(cashFlow,categories){
        $('.saveTransactionButton').click( ()=>{ 
            if(inputTransaction.value){
                categories.push(inputTransaction.value);
                this.transfer(categories,cashFlow)
                window.localStorage.incomeCategories = this.Categories[0];
                window.localStorage.consumptionCategories = this.Categories[1];
            }
        })
    },
    deleteCategory:function(categories){ 
        $deleteButton = $('<button class="deleteButton">Delete</button>');
        $(".saveTransactionButton").replaceWith($deleteButton);
        $('#inputTransaction').remove();

            $deleteButton.click( ()=>{
                categories.splice(categories.indexOf( $('.selectCategory').val()),1);//удаляем выбранный элемент из массива
                $('.selectCategory').empty();
                this.addCategoriesToSelect(categories);
                window.localStorage.incomeCategories = this.Categories[0];
                window.localStorage.consumptionCategories = this.Categories[1];
        })
    }
}

window.onload = () =>{ 

    if(window.localStorage.balance){//отрисовка данных с локального хранилища
        $('#balance').html(window.localStorage.balance);
        Wallet.balance = +window.localStorage.balance;
    }
    if((window.localStorage.incomeCategories) || (window.localStorage.consumptionCategories)){
        Wallet.Categories[0] = window.localStorage.incomeCategories.split(',')
        Wallet.Categories[1] = window.localStorage.consumptionCategories.split(',')
    }
    $('#transactionList').html(window.localStorage.transactionList);


    Wallet.transfer(Wallet.Categories[0],'Income')//Заполняем поле проведения транзакций при первой загрузке
    Wallet.saveTransaction('Income');


    $('.incomeAndConsumption').each((item)=>{  

        $('.incomeAndConsumption').eq(item).mouseover( () =>{ //при наведении мыши выводим подменю
            $('.changeCategory').eq(item).show();
        })
        $('.incomeAndConsumption').eq(item).mouseout( () =>{ //убираем мышь— скрываем подменю
            $('.changeCategory').eq(item).hide();  
        })
        
        $('.addTransaction').eq(item).click( ()=>{ // добавляем транзакцию поступления/расхода средств
            Wallet.transfer( Wallet.Categories[item], $('.addTransaction').eq(item).html() );
            Wallet.saveTransaction( $('.addTransaction').eq(item).html() );
        }) 

        $('.addCategory').eq(item).click( ()=>{ // добавляем категорию поступления/расхода средств
            Wallet.transfer( Wallet.Categories[item], $('.addCategory').eq(item).html() );
            Wallet.saveChanges( $('.addCategory').eq(item).html(), Wallet.Categories[item] );
        }) 

        $(".deleteCategory").eq(item).click( ()=>{//// удаляем категорию поступления/расхода средств
            Wallet.transfer( Wallet.Categories[item],$('.deleteCategory').eq(item).html() )
            Wallet.deleteCategory( Wallet.Categories[item] )
        })
    })
}



