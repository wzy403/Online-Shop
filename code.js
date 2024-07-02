//variables
var all_catagory = getColumn("shop_items","Catagory");
var all_items = getColumn("shop_items","Items");
var quantity = getColumn("shop_items","Quantity");
var price = getColumn("shop_items","Price");
var all_image = getColumn("shop_items","Image");
var print_catagory = ["Please select a Catagory"];
var Temp_items = ["Please select an item"];
var temp_price = [];
var Temp_quantity = [];
var temp_image = [];
var items_buy = [];
var how_much_buy = [];
var price_buy = [];
var number_conunt = [];
var temp_total;
var total;
var code_num;
var card_num;
var new_stock1;
var new_stock2;
var new_price;
var order = 0;
var verifi_code;
var admin_name = "admin";
var admin_pass = "12345";
var copy_number_conunt;
var no_image = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png";
/////////////////////////////

// setting the defult value
// console.log(getColumn("shop_items","Catagory"));
// for(var i = 0; i < all_catagory.length; i++){
//   if(check_repeat(i)== true){
//     appendItem(print_catagory,all_catagory[i]);
//   }
// }
// update_start_screen();


//start_screen code
var start_name;
var end_name;
var catagory_bar_click_count = 0;
onEvent("big_catagory_dropdown","click",function(){ //when click the big_catagory_dropdown button click it will
                                                    //get all the data that needed
  if(catagory_bar_click_count == 0){
    start_name = getText("big_catagory_dropdown");
    catagory_bar_click_count++;
  }else{
    end_name = getText("big_catagory_dropdown");
    if(end_name != start_name){
      setProperty("item_dropdown","index",0);
      setText("items_descrption","");
      catagory_bar_click_count = 0;
    }else{
      catagory_bar_click_count = 0;
    }
  }
  
  var catagory = getText("big_catagory_dropdown");
  
  
  //check if catagory is same as in print_catagory
  for(var y = 0; y < print_catagory.length; y++){
    if(catagory == print_catagory[y]){
      Temp_items = ["Please select an item"];
      temp_price = [];
      Temp_quantity = [];
      temp_image = [];
      
      for(var i = 0; i < all_catagory.length; i++){
        if(all_catagory[i] == print_catagory[y]){
          appendItem(Temp_items,all_items[i]);
          appendItem(Temp_quantity,quantity[i]);
          appendItem(temp_price,price[i]);
          appendItem(temp_image,all_image[i]);
        }
      }
    }
  }
  
  update_start_screen();
  

});


onEvent("item_dropdown","click",function(){ //when user selcte a item, show's the stock & price & image for that items
  var now_item = getText("item_dropdown");
  for(var i = 0; i < Temp_items.length-1; i++){
    if(Temp_items[i + 1] == now_item){
      if(temp_price[i] == undefined){
        Temp_quantity[i] = 0;
        temp_price[i] = 0;
        temp_image[i] = no_image;
      }
      setText("items_descrption","Stock: " + Temp_quantity[i] + "\n" + "Price: $" + temp_price[i]);
      setProperty("items_image","image",temp_image[i]);
    }
  }
});


var skip_count = 0;
onEvent("add_to_cart_button","click",function(){  //when add_to_cart_button click update the info to the cart list and also update the data
  readRecords("shop_items", {}, function(records) { //read the data from the database
    for(var i = 0; i < records.length; i++){
      if(records[i].Items == getText("item_dropdown")){
        new_stock1 = quantity[i] - getNumber("how_much");
        if(quantity[i] == 0){
          prompt("Sorry, we ran out the stock for " +  records[i].Items + ". Please try again later!");
          return;
        }else if(quantity[i] == null){
          prompt("Sorry, we ran out the stock for " +  records[i].Items + ". Please try again later!");
          return;
        }else if(new_stock1 < 0){
          prompt("Sorry, we don't have " + getNumber("how_much") + " " + records[i].Items + "(s) in the stock right now. Please try again later!");
          return;
        }else if(new_stock1 >= 0){
          updateRecord("shop_items", {
            id:records[i].id, 
            Catagory:records[i].Catagory,
            Items:records[i].Items,
            Price:records[i].Price,
            Quantity:new_stock1,
            Image:records[i].Image}, function(record, success) {  //update the record when user buy a item, it will take away how much user bought from the data
              if(success == true){
                
                //update the new and get info, then store them
                
                quantity = getColumn("shop_items","Quantity");
                
                var temp_get_item = getText("item_dropdown");
                if(temp_get_item == "Please select an item"){
                  prompt("Please select an item before add to cart");
                  return;
                }
                if(check_buy_item_repeat(temp_get_item)== true){
                  appendItem(items_buy,getText("item_dropdown"));
                  appendItem(how_much_buy,getNumber("how_much"));
                }
                
                
                for(var i = 0; i < Temp_items.length; i++){
                  for(var x = skip_count; x < items_buy.length; x++){
                    if(Temp_items[i] == items_buy[x]){
                      appendItem(price_buy,temp_price[i - 1]);
                      skip_count++;
                    }
                  }
                  if(Temp_items[i] == getText("item_dropdown")){
                    order = i - 1;
                  }
                }
                
                Temp_quantity[order] = new_stock1;
                
                var now_item = getText("item_dropdown");
                for(var y = 0; y < Temp_items.length-1; y++){
                  if(Temp_items[0] == now_item){
                    setText("items_descrption","");
                  }else if(Temp_items[y + 1] == now_item){
                    setText("items_descrption","Stock: " + Temp_quantity[y] + "\n" + "Price: $" + temp_price[y]);
                  }
                }
                
              }
          });
        }
            
          
        
      }
    }
  });
  
  
});

onEvent("checkout_button","click",function(){ //if user click this button swich to next screen
  if(items_buy.length == 0){
    prompt("Please add an item to cart first!");
    return;
  }
  
  setScreen("cart_list_screen");
  setProperty("item_dropdown","options",["Please select an item"]);
  number_conunt = [];
  setText("items_descrption","");
  setProperty("big_catagory_dropdown","index",0);
  setProperty("item_dropdown","index",0);
  setProperty("items_image","image","");
  for(var x = 0; x < items_buy.length+1;x++){
    appendItem(number_conunt,x);
  }
  update_cart_list_screen();
  copy_number_conunt = number_conunt.length-1;

});




//cart_list_screen code

onEvent("delete_item_button","click",function(){  //when delete button click it will delete the item in the card
  var remove = getNumber("remove_input");

  
  if(remove == 0){
    prompt("Number '0' IS NOT an Item Number! Please enter a proper item number!");
    setText("remove_input","");
    return;
  }else if(remove > copy_number_conunt){
    prompt("We are sorry. The item number you entered does not found in the system. Please try again.");
    setText("remove_input","");
    return;
  }
  
  //read the data and try to find which item user want to delete in the cart
  readRecords("shop_items", {}, function(records) {
    for(var i = 0; i < records.length; i++){
      if(records[i].Items == items_buy[remove-1]){
        new_stock2 = quantity[i] + how_much_buy[remove-1];
        updateRecord("shop_items", {  
          id:records[i].id, 
          Catagory:records[i].Catagory,
          Items:records[i].Items,
          Price:records[i].Price,
          Quantity:new_stock2,
          Image:records[i].Image}, function(record, success){  //when it find the itee it will delete and update the data
            if(success == true){
              
              quantity = getColumn("shop_items","Quantity");
              
              skip_count--;
              
              removeItem(items_buy,remove-1);
              removeItem(how_much_buy,remove-1);
              removeItem(price_buy,remove-1);
              copy_number_conunt--;
              
              update_cart_list_screen();
              
              setText("remove_input","");
              
            }
        });
        
      }
    }
  });
  

});

onEvent("back_button","click",function(){ //back to the start_screen
  setProperty("big_catagory_dropdown","index",0);
  setProperty("item_dropdown","index",0);
  setScreen("start_screen");
});

onEvent("continue_checkout_button","click",function(){  //set to checkOut_screen and print out the info that needed
  setScreen("checkOut_screen");
  promo();
  setText("total_output","$" + total);
});






//checkOut_screen code

onEvent("back_to_cart_button","click",function(){ //if user click the back button go back to the last page
  setScreen("cart_list_screen");
});

onEvent("promo_code_input","input",promo);  //check if user put an promo code or not and if the promo code is working or not

onEvent("pay_button","click",function(){  //when user click the pay_button run the function belwo
  card_num = getText("credit_card_input");
  var check = card_num.toString().length; //covert and count how many does user input for the crited card
  if (isNaN(card_num) || check != 16){  //if it didn't have 16 dight or card number is not not a number
    prompt("Please enter a valid Credit Card number!"); //promt this
    setText("credit_card_input","");
  }else{  //if all stuff go ture then change to receipt_screen and diffle the credit_card_input
    setScreen("receipt_screen");
    setText("credit_card_input","");
  }
  
  
});





//receipt_screen code

onEvent("back_to_main_button","click",function(){ //when this button clicked, reset all the variable to defulte
  
  Temp_items = ["Please select an item"];
  price_buy = [];
  Temp_quantity = [];
  items_buy = [];
  how_much_buy = [];
  number_conunt = [];
  countdown_Switch = 1;
  code_num = "";
  skip_count = 0;
  setText("promotion_code_output","");
  update_start_screen();
  update_cart_list_screen();
  setScreen("start_screen");  //change to start_screen
});





//lottery_screen code

onEvent("lottery_section_button","click",function(){  //when this button clicked switch to lootery screen
  setProperty("items_image","image","");
  setScreen("lottery_screen");
});


var countdown_Switch = 1;
var promotion_code_output_text = "";
onEvent("get_code_button","click",function(){ //the whole section is to grenrete the promo code
  if(countdown_Switch == 1){
    code_num = "";
    var promotion_code = [];
    var ifopen = randomNumber(0,1);
    if(ifopen == 1){
      for(var i = 0; i < 6; i++){
        appendItem(promotion_code,randomNumber(0,9));
        code_num += promotion_code[i];
      }
      setText("promotion_code_output","Congratulation you earn a Promotion Code: " + code_num);
      promotion_code_output_text = getText("promotion_code_output");
      countdown_Switch = 3;
    }else{
      setText("promotion_code_output","To bad you earn nothing! Try next time!");
      promotion_code_output_text = getText("promotion_code_output");
      countdown_Switch = 0;
      hideElement("get_code_button");
    }
  }else if(countdown_Switch == 3){
    prompt("You already have a code! Stop pressing the button!");
    return;
  }
  if(countdown_Switch == 0){  //this is when you didn't get a code, it will start an 1min. cooldown
    var countdown = 60; 
    var status = 0;
    if(countdown_Switch == 0){
      timedLoop(1000, function() {
        countdown--;
        setText("seconds_label",countdown);
        setText("minutes_label","00 :");
        status = 0;
        if(countdown == 9){
          showElement("sec_backup");
          setPosition("seconds_label",193,80,70,40);
        }else if(countdown == 0){
          countdown_Switch = 1;
          setText("minutes_label","01 :");
          setPosition("seconds_label",185,80,70,40);
          setText("seconds_label","00");
          hideElement("sec_backup");
          showElement("get_code_button");
          stopTimedLoop();
        }
      });
    }
  }
});



onEvent("back_to_main_page_button","click",function(){  //back to srart screen when this got clicked
  setScreen("start_screen");
});


onEvent("promotion_code_output","input",function(){ //when user type //admin// it will switch to the admin screen for the admin
  var check_admin = getText("promotion_code_output");
  if(check_admin == "//admin//"){
    generate_verification_code();
    setText("promotion_code_output",promotion_code_output_text);
    setScreen("admin_screen");
  }
  
});


//admin_screen code

onEvent("verificationcode_display","click",generate_verification_code); //this event is to generate an verifiaction code

onEvent("login_button","click",function(){  //when this button clicked it will check the admin input and if all info right, it will go inside the consol
  var username = getText("username_input");
  var password = getText("pass_input");
  var verifi_input = getText("verificationcode_input");
  
  if(username == admin_name && password == admin_pass && verifi_input == verifi_code){  //check the input info
    hideElement("username_input");
    hideElement("pass_input");
    hideElement("verificationcode_display");
    hideElement("verificationcode_input");
    hideElement("login_button");
    showElement("change_items_info_button");
    showElement("add_items_button");
    showElement("admin_page_back_button");
    setText("pass_input","");
    setText("verificationcode_input","");
    setText("username_input","");
  }else if(username == admin_name && password == admin_pass && verifi_input != verifi_code){
    prompt("The verification code you entered did not matched. Please try again.");
    setText("pass_input","");
    setText("verificationcode_input","");
    generate_verification_code(); //re-genrate the verifi-code
  }else{
    prompt("Error! Unknown username or password");
    setText("pass_input","");
    setText("verificationcode_input","");
    generate_verification_code(); //re-genrate the verifi-code
  }
});

onEvent("change_items_info_button","click",function(){  //when user click this button it will led user to the items info change page
  Temp_items = ["Please select an item"];
  setProperty("change_info_big_catagory_dropdown","index",0);
  setText("change_info_items_descrption","");
  update_change_items_info_screen();
  setScreen("change_items_info_screen");
});

onEvent("add_items_button","click",function(){  //when user click this button it will led user to the add items page
  Temp_items = [];
  update_add_items_screen();
  setScreen("add_items_screen");
});

onEvent("admin_page_back_button","click",function(){  //back to main(start_screen)

  //reset all elements on the admin login page
  showElement("username_input");
  showElement("pass_input");
  showElement("verificationcode_display");
  showElement("verificationcode_input");
  showElement("login_button");
  
  hideElement("change_items_info_button");
  hideElement("add_items_button");
  hideElement("admin_page_back_button");
  
  setProperty("item_dropdown","index",0);
  setProperty("big_catagory_dropdown","index",0);
  setText("items_descrption","");
  
  setScreen("start_screen");
});

onEvent("admin_login_page_back_image","click",function(){ //back to main(start_screen)

  //reset all elements on the admin login page
  showElement("username_input");
  showElement("pass_input");
  showElement("verificationcode_display");
  showElement("verificationcode_input");
  showElement("login_button");
  
  hideElement("change_items_info_button");
  hideElement("add_items_button");
  hideElement("admin_page_back_button");
  
  setProperty("item_dropdown","index",0);
  setProperty("big_catagory_dropdown","index",0);
  setText("items_descrption","");
  
  setScreen("start_screen");
});


//change_items_info_screen code
onEvent("change_info_big_catagory_dropdown","click",function(){ //get all info that need when this dorpdown been clicked
  if(catagory_bar_click_count == 0){
    start_name = getText("change_info_big_catagory_dropdown");
    catagory_bar_click_count++;
  }else{
    end_name = getText("change_info_big_catagory_dropdown");
    if(end_name != start_name){
      setProperty("change_info_item_dropdown","index",0);
      setText("change_info_items_descrption","");
      setText("change_price_input","");
      catagory_bar_click_count = 0;
    }else{
      catagory_bar_click_count = 0;
    }
  }
  
  var catagory = getText("change_info_big_catagory_dropdown");
  
  
  for(var y = 0; y < print_catagory.length; y++){
    if(catagory == print_catagory[y]){
      Temp_items = ["Please select an item"];
      temp_price = [];
      Temp_quantity = [];
      temp_image = [];
      
      for(var i = 0; i < all_catagory.length; i++){
        if(all_catagory[i] == print_catagory[y]){
          appendItem(Temp_items,all_items[i]);
          appendItem(Temp_quantity,quantity[i]);
          appendItem(temp_price,price[i]);
          appendItem(temp_image,all_image[i]);
        }
      }
    }
  }
  
  update_change_items_info_screen();
  
});


var num;
var data_order;
onEvent("change_info_item_dropdown","click",function(){ //when user select the item show the info
  var now_item = getText("change_info_item_dropdown");
  for(var i = 0; i < Temp_items.length-1; i++){
    if(temp_price[i]== undefined){
      Temp_quantity[i] = 0;
      temp_price[i] = 0;
    }
    if(Temp_items[i + 1] == now_item){
      setText("change_info_items_descrption","Stock: " + Temp_quantity[i] + "\n" + "Price: $" + temp_price[i]);
      setText("change_price_input",temp_price[i]);
      if(temp_image[i] == undefined){
        setProperty("change_info_items_image","image",no_image);
      }else{
        setProperty("change_info_items_image","image",temp_image[i]);
      }
      num = i;
    }
  }
});


var new_image;
onEvent("change_info_items_image_input","input",function(){ //when admin decided to add an item image it will check this, and give a previwe of that image
  new_image = getText("change_info_items_image_input");
  if(new_image == ""){
    new_image = no_image;
  }else{
    setProperty("change_info_items_image","image",new_image);
  }
  
});

onEvent("change_info_submit_button","click",function(){ //when this got clicked check all info and update all info to the database and print those out
  readRecords("shop_items", {}, function(records) {
    for(var i = 0; i < records.length; i++){
      if(records[i].Items == getText("change_info_item_dropdown")){ //check if the recods item is match the crrent shows
        
        var check_stock = getText("change_stock_input");
        var check_price = getText("change_price_input");
        if(isNaN(check_stock) || isNaN(check_price) || check_price == ""){
          if(isNaN(check_stock) || isNaN(check_price)){
            prompt("The input is not a number");
            setText("change_stock_input","");
            setText("change_price_input",temp_price[num]);
            return;
          }else{
            setText("change_price_input",temp_price[num]);
            setText("change_stock_input","");
            prompt("Please enter a price for the item");
            return;
          }
          
          
        }else if(check_stock == ""){  //if user didn't update the stock it will only update the price
          new_price = getNumber("change_price_input");
          
          updateRecord("shop_items", {
            id:records[i].id, 
            Catagory:records[i].Catagory,
            Items:records[i].Items,
            Price:new_price,
            Quantity:records[i].Quantity,
            Image:new_image}, function(record, success) {
              if(success == true){
                
                price = getColumn("shop_items","Price");
                all_image = getColumn("shop_items","Image");
                
                for(var i = 0; i < Temp_items.length; i++){
                  if(Temp_items[i] == getText("change_info_item_dropdown")){
                    order = i - 1;
                  }
                }
                  
                temp_price[order] = new_price;
                  
                setText("change_stock_input","");
                setText("change_info_items_image_input","");
                  
                var now_item = getText("change_info_item_dropdown");
                for(var y = 0; y < Temp_items.length-1; y++){
                  if(Temp_items[y + 1] == now_item){
                    setText("change_info_items_descrption","Stock: " + Temp_quantity[y] + "\n" + "Price: $" + temp_price[y]);
                  }
                }
                prompt("Process complete");
                return; 
              }
              
          });
        }else{  //if user enter all info, then update them all
          if(quantity[i] == null){
            new_stock1 = getNumber("change_stock_input");
          }else{
            new_stock1 = quantity[i] + getNumber("change_stock_input");
          }
          
          new_price = getNumber("change_price_input");
          data_order = i;
          updateRecord("shop_items", {
            id:records[i].id, 
            Catagory:records[i].Catagory,
            Items:records[i].Items,
            Price:new_price,
            Quantity:new_stock1,
            Image:new_image}, function(record, success) {
              if(success == true){
                
                quantity = getColumn("shop_items","Quantity");
                price = getColumn("shop_items","Price");
                all_image = getColumn("shop_items","Image");
                
                for(var i = 0; i < Temp_items.length; i++){
                  if(Temp_items[i] == getText("change_info_item_dropdown")){
                    order = i - 1;
                  }
                }
                
                  //updata new info to temp_list
                  
                  Temp_quantity[order] = new_stock1;
                  temp_price[order] = new_price;
                  
                  
                  setText("change_stock_input","");
                  setText("change_info_items_image_input","");
                  
                //below is to update the new info after changing  
                var now_item = getText("change_info_item_dropdown");
                for(var y = 0; y < Temp_items.length-1; y++){
                  if(Temp_items[0] == now_item){
                    setText("change_info_items_descrption","");
                    setText("change_stock_input","");
                    setText("change_price_input","");
                  }else if(Temp_items[y + 1] == now_item){
                    setText("change_info_items_descrption","Stock: " + Temp_quantity[y] + "\n" + "Price: $" + temp_price[y]);
                  }
                }
                prompt("Process complete");
                return;
              }
              
          });
        }
      }
    }
    return;
  });
});

onEvent("change_info_back_image","click",function(){  //back to the admin_screen
  setScreen("admin_screen");
});


//add_items_screen code
var add_items_big_catagory_dropdown_click_count = 0;
var new_start_name;
var new_end_name;
onEvent("add_items_big_catagory_dropdown","click",function(){ //get all info that needed
  
  var catagory = getText("add_items_big_catagory_dropdown");
  if(catagory == "Please select a Catagory" && add_items_big_catagory_dropdown_click_count != 0){
    readRecords("shop_items", {}, function(records) { //this is to check are there any left over undefined stuff didn't clear. If so delete it
      for(var i = 0; i < records.length; i++){
        if(records[i].Items == undefined){
          deleteRecord("shop_items", {id:records[i].id}, function(success) {
            if(success == true){
              return;
            }
          });
        }
      }
      return;
    });
    add_items_big_catagory_dropdown_click_count = 0;
  }
  
  //done below is to gernerate an tamp data when user click a catgory
  
  //check the add_items_big_catagory_dropdown_click_count is just to get rid of the exture click produce by user
  if(add_items_big_catagory_dropdown_click_count == 0){
    start_name = getText("add_items_big_catagory_dropdown");
    
    readRecords("shop_items", {}, function(records) {
      for(var i = 0; i < records.length; i++){
        if(records[i].Items == undefined){
          deleteRecord("shop_items", {id:records[i].id}, function(success) {  //delete the tamp data when user click a catgory
            if(success == true){
              return;
            }
          });
        }
      }
      return;
    });
    
    add_items_big_catagory_dropdown_click_count++;
  }else if(add_items_big_catagory_dropdown_click_count == 1){ //gernerate an tamp data when user click a catgory
    end_name = getText("add_items_big_catagory_dropdown");
    if(end_name != start_name){
      if(catagory != "Please select a Catagory"){
        createRecord("shop_items", {
        Catagory:catagory,
        Price:0,
        Quantity:null}, function() {
          
          all_catagory = getColumn("shop_items","Catagory");
          
          new_start_name = getText("add_items_big_catagory_dropdown");
          
          update_add_items_screen();
          
          add_items_big_catagory_dropdown_click_count++;

          
        });
      }
    }
  }else if(add_items_big_catagory_dropdown_click_count == 2){ //more temp data stuff
    new_end_name = getText("add_items_big_catagory_dropdown");
    if(new_end_name != new_start_name){
      readRecords("shop_items", {}, function(records) {
        for(var i = 0; i < records.length; i++){
          if(records[i].Catagory == new_start_name && records[i].Items == undefined){
            deleteRecord("shop_items", {id:records[i].id}, function(success) {
              if(success == true){
                if(catagory != "Please select a Catagory"){
                  createRecord("shop_items", {
                  Catagory:new_end_name,
                  Price:0,
                  Quantity:null}, function() {
                    
                    all_catagory = getColumn("shop_items","Catagory");
                    
                    new_start_name = getText("add_items_big_catagory_dropdown");

                    
                    update_add_items_screen();
                    
                    return;
                  });
                }else{
                  add_items_big_catagory_dropdown_click_count = 0;
                  return;
                }
              return;
              }
            });
          }
        }
      });
    }
  }
  
  
  
  for(var y = 0; y < print_catagory.length; y++){
    if(catagory == print_catagory[y]){
      Temp_items = [];
      
      for(var i = 0; i < all_catagory.length; i++){
        if(all_catagory[i] == print_catagory[y]){
          appendItem(Temp_items,all_items[i]);
        }
      }
    }
  }
  
  update_add_items_screen();
});

onEvent("add_catagory_button","click",function(){ //add the gataory that admin input
    var check_Vinput = getText("add_catagory_input");
    
    if(check_Vinput == ""){
      prompt("Please enter a valid input!");
      return;
    }else{
      for(var i = 0; i < print_catagory.length; i++){
        if(check_Vinput == print_catagory[i]){
          prompt("The category you entered is already been declared");
          return;
        }
      }
      
      createRecord("shop_items", {  //create that data
        Catagory:check_Vinput,
        Price:0,
        Quantity:null}, function() {
          
          all_catagory = getColumn("shop_items","Catagory");
          
          appendItem(print_catagory,check_Vinput);
          
          setText("add_catagory_input","");
            
          update_add_items_screen();
          
          prompt("Process complete");
          return;
      });
    }
});

var add_new_items_button_click_count = 0;
onEvent("add_new_items_button","click",function(){  //add new items to whatever catgorey that admin choose
  var new_item = getText("add_items_input");
  var what_catagory = getText("add_items_big_catagory_dropdown");
  
  if(what_catagory == "Please select a Catagory"){
    prompt("Please selecte a Catagory first");
    setText("add_items_input","");
    return;
  }
  for(var i = 0; i<Temp_items.length; i++){
    if(new_item == Temp_items[i]){
      prompt("The item you entered has already been added");
      setText("add_items_input","");
      return;
    }
  }
  
  
  readRecords("shop_items", {}, function(records) { //read the date and check the match data

    for(var i = 0; i < records.length; i++){
      if(records[i].Catagory == what_catagory){
        if(records[i].Items == undefined){
          add_new_items_button_click_count++;
          updateRecord("shop_items", {
            id:records[i].id, 
            Catagory:records[i].Catagory,
            Items:new_item,
            Price:0,
            Quantity:null}, function(record, success) { //update the info
              if(success == true){
                
                all_items = getColumn("shop_items","Items");
                setText("add_items_input","");
                
                var catagory = getText("add_items_big_catagory_dropdown");
                
                for(var y = 0; y < print_catagory.length; y++){
                  if(catagory == print_catagory[y]){
                    Temp_items = [];
                    temp_price = [];
                    Temp_quantity = [];
                    
                    for(var i = 0; i < all_catagory.length; i++){
                      if(all_catagory[i] == print_catagory[y]){
                        appendItem(Temp_items,all_items[i]);
                      }
                    }
                  }
                }
                setProperty("add_items_big_catagory_dropdown","index",0);
                setText("add_items_list_display","");
                add_new_items_button_click_count = 0;
            }
              prompt("Process complete");
              return;
          });
          return;
        }
      
        
          
      
        
      }
      }
    }
  );
  
});

onEvent("add_items_back_page_image","click",function(){ //back to admin_screen
  setScreen("admin_screen");
});








/**********************
 * 
 * 
 * 
 * 
 * 
 *functions
 * 
 * 
 * 
 * 
/ **********************
*/



//function to check if there is any repeat in the all_catagory;
function check_repeat(i){
  for (var x = 0; x < print_catagory.length; x++){
    if(print_catagory[x]==all_catagory[i]){
      return false;
    }
  }
  return true;
}

//function to check is there any repeat in the cart list, if so combine them
function check_buy_item_repeat(i){
  for (var x = 0; x <= print_catagory.length; x++){
    if(items_buy[x]== i){
      how_much_buy[x] += getNumber("how_much");
      
      return false;
    }
  }
  return true;
}



//function to update screen 

//start_screen
function update_start_screen(){
  if(Temp_items.length == 2 && Temp_items[1] == undefined){
    Temp_items = ["No item in this Catagory"];
  }
  setProperty("item_dropdown","options",Temp_items);
  setProperty("big_catagory_dropdown","options",print_catagory);
}

//cart_list_screen
function update_cart_list_screen(){
  
  var temp_item_list = "";
  var temp_quantity_list = "";
  var temp__price_list = "";
  
  temp_total = 0;
  for(var i = 0; i < items_buy.length; i++){
    temp_item_list += number_conunt[i+1] + ". " + items_buy[i] + "\n";
    temp_quantity_list += how_much_buy[i] + "\n";
    temp__price_list += "$" + price_buy[i] * how_much_buy[i] + "\n";
        temp_total += price_buy[i] * how_much_buy[i];
    
  }
  
  setText("cart_item_list",temp_item_list);
  setText("cart_quantity_list",temp_quantity_list);
  setText("cart_price_list",temp__price_list);
  
  var taxes = Math.round(temp_total*12) / 100;
  setText("taxes_box","Taxes: " + taxes);
  temp_total = Math.round(temp_total*100)/100;
  total = taxes + temp_total;
  setText("subtotal_text","Subtotal: " + "$" + temp_total);
}

//change_items_info_screen
function update_change_items_info_screen(){
  if(Temp_items.length == 2 && Temp_items[1] == undefined){
    Temp_items = ["No item in this Catagory"];
  }
  setProperty("change_info_item_dropdown","options",Temp_items);
  setProperty("change_info_big_catagory_dropdown","options",print_catagory);
}

//add_items_screen
function update_add_items_screen(){
  var display = "";
  for(var i = 0; i < Temp_items.length; i++){
    if(Temp_items[0] == undefined){
      display = "Nothing is under this Catagory";
      break;
    }else if(Temp_items[i] == undefined){
      continue;
    }
    display += i+1 + ". " + Temp_items[i] + "\n";
  }
  setText("add_items_list_display",display);
  setProperty("add_items_big_catagory_dropdown","options",print_catagory);
}



//check promo code function
function promo(){
  var promo_code = getText("promo_code_input");
  if (promo_code == code_num){
    var new_temp_total = temp_total*0.5;
    setText("overview_output",number_conunt.length-1 + "\n\n" + "$" + temp_total + "\n\n" + "-" + new_temp_total + "\n\n" + Math.round(new_temp_total*5) / 100 + "\n\n" + Math.round(new_temp_total*7) / 100);
    var new_total = new_temp_total + Math.round(new_temp_total*12) / 100;
    setText("total_output","$" + new_total);
  }else{
    setText("overview_output",number_conunt.length-1 + "\n\n" + "$" + temp_total + "\n\n" + "-0.00" + "\n\n" + Math.round(temp_total*5) / 100 + "\n\n" + Math.round(temp_total*7) / 100);
  }
}

//Generate verification code function
function generate_verification_code(){
  verifi_code = "";
  var verifi_code_list = [];
  for(var i = 0; i < 4; i++){
    appendItem(verifi_code_list,randomNumber(0,9));
    verifi_code += verifi_code_list[i];
  }
  setText("verificationcode_display","verification code: " + verifi_code);
}

