const countdownForm =document.getElementById('countdownForm');
const inputContainer=document.getElementById('input-container');
const dateEl=document.getElementById('date-picker');
const countdownEl=document.getElementById('countdown');

const countdownTitleEl=document.getElementById('countdown-title');
const countdownButtonEl=document.getElementById('countdown-button');
const timeEl=document.querySelectorAll('span');

const completeEl=document.getElementById('complete');
const completeInfoEl=document.getElementById('complete-info');
const completeButtonEl=document.getElementById('complete-button');

//variable control process

let countdownTitle='';
let countdownDate='';

let countdownValue=Date; //collectdate form Form
let countdownActive;     //Timer
let saveCountdown;       //collect title & alarm date (object)

//variable for calculate time
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

countdownForm.addEventListener('submit',updateCountdown);

function updateCountdown(e){
    e.preventDefault();
    countdownTitle=e.srcElement[0].value;
    countdownDate=e.srcElement[1].value;
    
    if(countdownTitle === ''){
        Swal.fire({
            icon: 'error',
            title: 'Warning!',
            text: 'Please input title!',  
          })
    }
    else{
        if(countdownDate === ''){
            Swal.fire({
                icon: 'error',
                title: 'Warning!',
                text: 'Please input date!',  
              })
        }else{
            Swal.fire({
                icon: 'success',
                title: 'Your appointment has been saved',
                showConfirmButton: false,
                timer: 2000
              })
            saveCountdown={title:countdownTitle, date:countdownDate};
            localStorage.setItem("countdown",JSON.stringify(saveCountdown));
            countdownValue=new Date(countdownDate).getTime();  //Time set
            setUpTime();
        }
    }
}
    // Create function for calculate time for countdown display
    function setUpTime(){
        countdownActive=setInterval(()=>{
            const now = new Date().getTime();
            const diff = countdownValue - now;
            const days = Math.floor(diff/day);
            const hours = Math.floor((diff%day)/hour);
            const minutes = Math.floor((diff%hour)/minute);
            const seconds = Math.floor((diff%minute)/second);
            inputContainer.hidden=true;
            if(diff<0){
                countdownEl.hidden=true;
                completeEl.hidden=false;
                completeInfoEl.textContent = `${countdownTitle} on ${countdownDate}`
                clearInterval(countdownActive);

            }else{
                countdownTitleEl.textContent = `${countdownTitle}`;
                // Adjust time to display 2 digits for hours, minutes and seconds.
                timeEl[0].textContent=`${days}`;
                timeEl[1].textContent=`${hours < 10 ? "0"+ hours : hours}`;
                timeEl[2].textContent=`${minutes < 10 ? "0"+ minutes : minutes}`;
                timeEl[3].textContent=`${seconds < 10 ? "0" + seconds : seconds}`; 
                countdownEl.hidden=false;
                completeEl.hidden=true;

            }
        },second);
    }

// Create function to recall data when local storage already have key --> whenever user refresh web still show old data.
function callDatainStore(){
    if(localStorage.getItem("countdown")){
        inputContainer.hidden=true;
        saveCountdown=JSON.parse(localStorage.getItem("countdown"));
        countdownTitle=saveCountdown.title;
        countdownDate=saveCountdown.date;
        countdownValue=new Date(countdownDate).getTime();
        setUpTime();
    }
}

// Create function with alert confirmation to before delete and return default. 
function reset(){

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'btn btn-success',
        cancelButtonColor: 'btn btn-danger',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your appointment has been delete.',
            'success'
          )
        localStorage.removeItem("countdown");
        countdownEl.hidden=true;
        completeEl.hidden=true;
        inputContainer.hidden=false;
        clearInterval(countdownActive);
        countdownTitle='';
        countdownDate='';
        }
      })
    
}

//Create function to return default page
function newList(){
        localStorage.removeItem("countdown");
        countdownEl.hidden=true;
        completeEl.hidden=true;
        inputContainer.hidden=false;
        clearInterval(countdownActive);
        countdownTitle='';
        countdownDate='';
}
      
callDatainStore();

countdownButtonEl.addEventListener('click',reset);
completeButtonEl.addEventListener('click',newList);


