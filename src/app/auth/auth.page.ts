import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin = true;
  isLoading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  //Begin action to process submitted login or signup form
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    // const data = [
    //   {
    //        'firstname' : 'Omoniyi',
    //        'lastname' : 'Abel'
    //     },
    //     {
    //        'firstname' : 'Israel',
    //        'lastname' : 'Koki'
    //     },
    //     {
    //        'firstname' : 'Boyle',
    //        'lastname' : 'Akali'
    //     },
    //     {
    //        'firstname' : 'Damian',
    //        'lastname' : 'Kyle'
    //     },
    //     {
    //        'firstname' : 'Alaknanda',
    //        'lastname' : 'Mandal'
    //     },
    //     {
    //        'firstname' : 'Gropasi',
    //        'lastname' : 'Patrick'
    //     },
    //     {
    //        'firstname' : 'Vijayent',
    //        'lastname' : 'Dave'
    //     },
    //     {
    //        'firstname' : 'Ese',
    //        'lastname' : 'Kola'
    //     },
    //     {
    //        'firstname' : 'Roma',
    //        'lastname' : 'Sen'
    //     },
    //     {
    //        'firstname' : 'Paul',
    //        'lastname' : 'Dobson'
    //     },
    //     {
    //        'firstname' : 'Mukul',
    //        'lastname' : 'Vasa'
    //     },
    //     {
    //        'firstname' : 'Kathreen',
    //        'lastname' : 'Eze'
    //     },
    //     {
    //        'firstname' : 'Kitoko',
    //        'lastname' : 'Garba'
    //     },
    //     {
    //        'firstname' : 'Joel',
    //        'lastname' : 'Atikah'
    //     },
    //     {
    //        'firstname' : 'Khari',
    //        'lastname' : 'Nyaga'
    //     },
    //     {
    //        'firstname' : 'Talatu',
    //        'lastname' : 'Ibrahim'
    //     },
    //     {
    //        'firstname' : 'Aisha',
    //        'lastname' : 'Elerenweju'
    //     },
    //     {
    //        'firstname' : 'Rehema',
    //        'lastname' : 'Richards'
    //     },
    //     {
    //        'firstname' : 'Kiden',
    //        'lastname' : 'Ajoola'
    //     },
    //     {
    //        'firstname' : 'Elwin',
    //        'lastname' : 'Borer'
    //     },
    //     {
    //        'firstname' : 'Farah',
    //        'lastname' : 'Peri'
    //     },
    //     {
    //        'firstname' : 'Charandeep',
    //        'lastname' : 'Bains'
    //     },
    //     {
    //        'firstname' : 'Onyemaechi',
    //        'lastname' : 'Nnanna'
    //     },
    //     {
    //        'firstname' : 'Marie',
    //        'lastname' : 'Boone'
    //     },
    //     {
    //        'firstname' : 'Yamini',
    //        'lastname' : 'Raj'
    //     },
    //     {
    //        'firstname' : 'Izefia',
    //        'lastname' : 'Baita'
    //     },
    //     {
    //        'firstname' : 'Ifrah',
    //        'lastname' : 'Afolabi'
    //     },
    //     {
    //        'firstname' : 'Layla',
    //        'lastname' : 'Lago'
    //     },
    //     {
    //        'firstname' : 'Olaoni',
    //        'lastname' : 'pekun'
    //     },
    //     {
    //        'firstname' : 'Ragini',
    //        'lastname' : 'Raju'
    //     },
    //     {
    //        'firstname' : 'Abiodun',
    //        'lastname' : 'Oluwasegun'
    //     },
    //     {
    //        'firstname' : 'Tejumola',
    //        'lastname' : 'Afeez'
    //     },
    //     {
    //        'firstname' : 'Nworie',
    //        'lastname' : 'Noelia'
    //     },
    //     {
    //        'firstname' : 'Ryann',
    //        'lastname' : 'Maggio'
    //     },
    //     {
    //        'firstname' : 'Femi',
    //        'lastname' : 'Olufemi'
    //     },
    //     {
    //        'firstname' : 'Oko',
    //        'lastname' : 'Oluwatoke'
    //     },
    //     {
    //        'firstname' : 'Amo',
    //        'lastname' : 'Oluwatunmise'
    //     },
    //     {
    //        'firstname' : 'Sarah',
    //        'lastname' : 'Oluwadamilola'
    //     },
    //     {
    //        'firstname' : 'Tolu',
    //        'lastname' : 'Jibola'
    //     },
    //     {
    //        'firstname' : 'Kamsi',
    //        'lastname' : 'Ade'
    //     },
    //     {
    //        'firstname' : 'Aadish',
    //        'lastname' : 'Chander'
    //     },
    //     {
    //        'firstname' : 'Vikrant',
    //        'lastname' : 'Khurana'
    //     },
    //     {
    //        'firstname' : 'Pam',
    //        'lastname' : 'Adelomo'
    //     },
    //     {
    //        'firstname' : 'Aniket',
    //        'lastname' : 'Sharma'
    //     },
    //     {
    //        'firstname' : 'Grant',
    //        'lastname' : 'Kaur'
    //     },
    //     {
    //        'firstname' : 'Binod',
    //        'lastname' : 'Kapoor'
    //     },
    //     {
    //        'firstname' : 'Osonduagwuike',
    //        'lastname' : 'Odili'
    //     },
    //     {
    //        'firstname' : 'Kelechi',
    //        'lastname' : 'Cartwright'
    //     },
    //     {
    //        'firstname' : 'Lucienne',
    //        'lastname' : 'Oko'
    //     },
    //     {
    //        'firstname' : 'Ndubuisi',
    //        'lastname' : 'Olejuru'
    //     },
    //     {
    //        'firstname' : 'Jiya',
    //        'lastname' : 'Bansal'
    //     },
    //     {
    //        'firstname' : 'Kathreen',
    //        'lastname' : 'Eze'
    //     },
    //     {
    //        'firstname' : 'Mohit',
    //        'lastname' : 'Bali'
    //     },
    //     {
    //        'firstname' : 'Damini',
    //        'lastname' : 'Golla'
    //     },
    //     {
    //        'firstname' : 'Iweobiegbulam',
    //        'lastname' : 'Akabueze'
    //     },
    //     {
    //        'firstname' : 'Nwabugwu',
    //        'lastname' : 'Okwukwe'
    //     },
    //     {
    //        'firstname' : 'Rakhi',
    //        'lastname' : 'Vyas'
    //     },
    //     {
    //        'firstname' : 'Ikemefuna',
    //        'lastname' : 'Schuster'
    //     },
    //     {
    //        'firstname' : 'Melba',
    //        'lastname' : 'Balistreri'
    //     },
    //     {
    //        'firstname' : 'Kenneth',
    //        'lastname' : 'Botsford'
    //     },
    //     {
    //        'firstname' : 'Manoj',
    //        'lastname' : 'Binnani'
    //     },
    //     {
    //        'firstname' : 'Umesh',
    //        'lastname' : 'Mehra'
    //     },
    //     {
    //        'firstname' : 'Genesis',
    //        'lastname' : 'Patel'
    //     },
    //     {
    //        'firstname' : 'Vinay',
    //        'lastname' : 'Pav'
    //     },
    //     {
    //        'firstname' : 'Sanjay',
    //        'lastname' : 'Shumgaban'
    //     },
    //     {
    //        'firstname' : 'Upasana',
    //        'lastname' : 'Rampersad'
    //     },
    //     {
    //        'firstname' : 'Nilima',
    //        'lastname' : 'Sachar'
    //     },
    //     {
    //        'firstname' : 'Niyi',
    //        'lastname' : 'Cartwright'
    //     },
    //     {
    //        'firstname' : 'Jawahar',
    //        'lastname' : 'Grover'
    //     },
    //     {
    //        'firstname' : 'Adejo',
    //        'lastname' : 'Oluwafunmilola'
    //     },
    //     {
    //        'firstname' : 'Taiwo',
    //        'lastname' : 'Oluwaremilekun'
    //     },
    //     {
    //        'firstname' : 'Marchus',
    //        'lastname' : 'Bamidele'
    //     },
    //     {
    //        'firstname' : 'Acton',
    //        'lastname' : 'Gbohunmi'
    //     },
    //     {
    //        'firstname' : 'Gbose',
    //        'lastname' : 'Afolabi'
    //     },
    //     {
    //        'firstname' : 'Mary',
    //        'lastname' : 'Fiayosemi'
    //     },
    //     {
    //        'firstname' : 'Kamdibe',
    //        'lastname' : 'Koelpin'
    //     },
    //     {
    //        'firstname' : 'Olashalew',
    //        'lastname' : 'Biodun'
    //     },
    //     {
    //        'firstname' : 'Idris',
    //        'lastname' : 'Garba'
    //     },
    //     {
    //        'firstname' : 'Isaac',
    //        'lastname' : 'Olanrewaju'
    //     },
    //     {
    //        'firstname' : 'Dawson',
    //        'lastname' : 'Heller'
    //     },
    //     {
    //        'firstname' : 'Chinonyelum',
    //        'lastname' : 'Okwukwe'
    //     },
    //     {
    //        'firstname' : 'Toluwalope',
    //        'lastname' : 'Omoke'
    //     },
    //     {
    //        'firstname' : 'Timothy',
    //        'lastname' : 'Nwachukwu'
    //     },
    //     {
    //        'firstname' : 'Dele',
    //        'lastname' : 'Oluwatoyi'
    //     },
    //     {
    //        'firstname' : 'Funmi',
    //        'lastname' : 'Temidayo'
    //     },
    //     {
    //        'firstname' : 'Pranay',
    //        'lastname' : 'Mitra'
    //     },
    //     {
    //        'firstname' : 'Rene',
    //        'lastname' : 'Adisa'
    //     },
    //     {
    //        'firstname' : 'Tolu',
    //        'lastname' : 'Bidemi'
    //     },
    //     {
    //        'firstname' : 'Ben',
    //        'lastname' : 'Omobolanle'
    //     },
    //     {
    //        'firstname' : 'Haruna',
    //        'lastname' : 'Mawa'
    //     },
    //     {
    //        'firstname' : 'Liam',
    //        'lastname' : 'Adeyemi'
    //     },
    //     {
    //        'firstname' : 'Peter',
    //        'lastname' : 'Omoyeni'
    //     },
    //     {
    //        'firstname' : 'Similoluwa',
    //        'lastname' : 'Okowa'
    //     },
    //     {
    //        'firstname' : 'Omodele',
    //        'lastname' : 'Adeniyi'
    //     },
    //     {
    //        'firstname' : 'Ifedapo',
    //        'lastname' : 'Adeniyi'
    //     },
    //     {
    //        'firstname' : 'Tope',
    //        'lastname' : 'Abana'
    //     },
    //     {
    //        'firstname' : 'Ndubuagha',
    //        'lastname' : 'Kamdibe'
    //     },
    //     {
    //        'firstname' : 'Sochima',
    //        'lastname' : 'Ibeamaka'
    //     },
    //     {
    //        'firstname' : 'Fay',
    //        'lastname' : 'Uwaezuoke'
    //     },
    //     {
    //        'firstname' : 'Alycia',
    //        'lastname' : 'Bartoletti'
    //     },
    //     {
    //        'firstname' : 'Okwuoma',
    //        'lastname' : 'Kenenna'
    //     },
    //     {
    //        'firstname' : 'Hira',
    //        'lastname' : 'Puri'
    //     },
    //     {
    //        'firstname' : 'Yobanna',
    //        'lastname' : 'Okoro'
    //     },
    //     {
    //        'firstname' : 'Ukaegbunam',
    //        'lastname' : 'Onwughara'
    //     },
    //     {
    //        'firstname' : 'Mimi',
    //        'lastname' : 'Ramson'
    //     },
    //     {
    //        'firstname' : 'Ishola',
    //        'lastname' : 'Yakubu'
    //     },
    //     {
    //        'firstname' : 'Lowell',
    //        'lastname' : 'Douglas'
    //     },
    //     {
    //        'firstname' : 'Denis',
    //        'lastname' : 'Treutel'
    //     },
    //     {
    //        'firstname' : 'Taqiy',
    //        'lastname' : 'Husain-Bata'
    //     },
    //     {
    //        'firstname' : 'Adanma',
    //        'lastname' : 'Amechi'
    //     },
    //     {
    //        'firstname' : 'Karim',
    //        'lastname' : 'Bhavsar'
    //     },
    //     {
    //        'firstname' : 'Pratama',
    //        'lastname' : 'Hidayanti'
    //     },
    //     {
    //        'firstname' : 'Dhanu',
    //        'lastname' : 'Aryanti'
    //     },
    //     {
    //        'firstname' : 'Farqy',
    //        'lastname' : 'Manar'
    //     },
    //     {
    //        'firstname' : 'Wahyu',
    //        'lastname' : 'Haris-Restiandari'
    //     },
    //     {
    //        'firstname' : 'Agus',
    //        'lastname' : 'Ahmadi'
    //     },
    //     {
    //        'firstname' : 'Priyohadi',
    //        'lastname' : 'Listyani'
    //     },
    //     {
    //        'firstname' : 'Rian',
    //        'lastname' : 'Mustika'
    //     },
    //     {
    //        'firstname' : 'Aswin',
    //        'lastname' : 'Widyasmoro'
    //     },
    //     {
    //        'firstname' : 'Pratama',
    //        'lastname' : 'Sinuka'
    //     },
    //     {
    //        'firstname' : 'Dede',
    //        'lastname' : 'Samson'
    //     },
    //     {
    //        'firstname' : 'Joseph ',
    //        'lastname' : 'Arjanggi'
    //     },
    //     {
    //        'firstname' : 'Doni',
    //        'lastname' : 'Mayori'
    //     },
    //     {
    //        'firstname' : 'Dikposa',
    //        'lastname' : 'Oktazilvia'
    //     },
    //     {
    //        'firstname' : 'Edwin',
    //        'lastname' : 'Anindya'
    //     },
    //     {
    //        'firstname' : 'Aziz',
    //        'lastname' : 'Ishola'
    //     },
    //     {
    //        'firstname' : 'Yusuf',
    //        'lastname' : 'Dyarini'
    //     },
    //     {
    //        'firstname' : 'Eka',
    //        'lastname' : 'Umoh'
    //     },
    //     {
    //        'firstname' : 'Avicenna',
    //        'lastname' : 'Heriansyah'
    //     },
    //     {
    //        'firstname' : 'Ariyadi',
    //        'lastname' : 'Arisa'
    //     },
    //     {
    //        'firstname' : 'Garin',
    //        'lastname' : 'Amira'
    //     },
    //     {
    //        'firstname' : 'Yoedhistiera',
    //        'lastname' : 'Ciptasari'
    //     },
    //     {
    //        'firstname' : 'Michael',
    //        'lastname' : 'Prawita'
    //     },
    //     {
    //        'firstname' : 'Richard',
    //        'lastname' : 'Islami'
    //     },
    //     {
    //        'firstname' : 'Sofyan',
    //        'lastname' : 'Hapsari'
    //     },
    //     {
    //        'firstname' : 'Acton',
    //        'lastname' : 'Ebrima'
    //     },
    //     {
    //        'firstname' : 'Dee',
    //        'lastname' : 'Oktavianty'
    //     },
    //     {
    //        'firstname' : 'Syaibatul',
    //        'lastname' : 'Juliyanto'
    //     },
    //     {
    //        'firstname' : 'Yutama',
    //        'lastname' : 'Mulyanti'
    //     },
    //     {
    //        'firstname' : 'Yenu',
    //        'lastname' : 'Cardinata'
    //     },
    //     {
    //        'firstname' : 'Syahrul',
    //        'lastname' : 'Isham'
    //     },
    //     {
    //        'firstname' : 'Naveed',
    //        'lastname' : 'Morun'
    //     },
    //     {
    //        'firstname' : 'Tochukwu',
    //        'lastname' : 'Chigelu'
    //     },
    //     {
    //        'firstname' : 'Jatin',
    //        'lastname' : 'Virk'
    //     },
    //     {
    //        'firstname' : 'Onyinyechukwuka',
    //        'lastname' : 'Ziko'
    //     },
    //     {
    //        'firstname' : 'Onyekachukwu',
    //        'lastname' : 'Amara'
    //     },
    //     {
    //        'firstname' : 'Chidinma',
    //        'lastname' : 'Obey'
    //     },
    //     {
    //        'firstname' : 'Onyemere',
    //        'lastname' : 'Elias'
    //     },
    //     {
    //        'firstname' : 'Osinachi',
    //        'lastname' : 'Obiajulu'
    //     },
    //     {
    //        'firstname' : 'Edem',
    //        'lastname' : 'ACHIENG'
    //     },
    //     {
    //        'firstname' : 'Ugonna',
    //        'lastname' : 'Okwudili'
    //     },
    //     {
    //        'firstname' : 'FATIMATOU',
    //        'lastname' : 'Martins'
    //     },
    //     {
    //        'firstname' : 'Okagbue',
    //        'lastname' : 'Dilibe'
    //     },
    //     {
    //        'firstname' : 'CHIMWALA',
    //        'lastname' : 'Kam'
    //     },
    //     {
    //        'firstname' : 'Nelly',
    //        'lastname' : 'DUMISANI'
    //     },
    //     {
    //        'firstname' : 'Ifeanacho',
    //        'lastname' : 'Chinomso'
    //     },
    //     {
    //        'firstname' : 'Samuel',
    //        'lastname' : 'EFEMENA'
    //     },
    //     {
    //        'firstname' : 'Obiuto',
    //        'lastname' : 'Kamalu'
    //     },
    //     {
    //        'firstname' : 'Tanuja',
    //        'lastname' : 'Mehrotra'
    //     },
    //     {
    //        'firstname' : 'Leon',
    //        'lastname' : 'BUSINGE'
    //     },
    //     {
    //        'firstname' : 'Kunti',
    //        'lastname' : 'Das'
    //     },
    //     {
    //        'firstname' : 'Mohammed',
    //        'lastname' : 'Chanongo'
    //     },
    //     {
    //        'firstname' : 'Yohanna',
    //        'lastname' : 'Afeez'
    //     },
    //     {
    //        'firstname' : 'Junaidu',
    //        'lastname' : 'ADAMU'
    //     },
    //     {
    //        'firstname' : 'Bello',
    //        'lastname' : 'ALBARKA'
    //     },
    //     {
    //        'firstname' : 'Polo',
    //        'lastname' : 'FAIQAH'
    //     },
    //     {
    //        'firstname' : 'Fuad',
    //        'lastname' : 'GIWA'
    //     },
    //     {
    //        'firstname' : 'Madaki',
    //        'lastname' : 'Gowon'
    //     },
    //     {
    //        'firstname' : 'Remi',
    //        'lastname' : 'AKOSUA'
    //     },
    //     {
    //        'firstname' : 'ABOSEDE',
    //        'lastname' : 'Abioye'
    //     },
    //     {
    //        'firstname' : 'Ali',
    //        'lastname' : 'HADIZATU'
    //     },
    //     {
    //        'firstname' : 'Ken Nabil',
    //        'lastname' : 'Mehrotra'
    //     },
    //     {
    //        'firstname' : 'Mahmud',
    //        'lastname' : 'IBRAHIMU'
    //     },
    //     {
    //        'firstname' : 'Olu',
    //        'lastname' : 'ADWOA'
    //     },
    //     {
    //        'firstname' : 'Rashidi',
    //        'lastname' : 'Idirisu'
    //     },
    //     {
    //        'firstname' : 'Mairo',
    //        'lastname' : 'Obo'
    //     },
    //     {
    //        'firstname' : 'Amin',
    //        'lastname' : 'ABDOULAYE'
    //     },
    //     {
    //        'firstname' : 'Michael',
    //        'lastname' : 'Edet'
    //     },
    //     {
    //        'firstname' : 'Priye',
    //        'lastname' : 'Uzor'
    //     },
    //     {
    //        'firstname' : 'Ikenna',
    //        'lastname' : 'Echie'
    //     },
    //     {
    //        'firstname' : 'Audu',
    //        'lastname' : 'Mahmud'
    //     },
    //     {
    //        'firstname' : 'Bony',
    //        'lastname' : 'Okky-Aswati'
    //     },
    //     {
    //        'firstname' : 'Paul',
    //        'lastname' : 'Okogbule'
    //     },
    //     {
    //        'firstname' : 'Ifeanyi',
    //        'lastname' : 'Ogbu'
    //     },
    //     {
    //        'firstname' : 'Wilson',
    //        'lastname' : 'Jammeh'
    //     }
    // ];

    // for(let i = 0; i < data.length; i++ ){
    //   const firstname = data[i].firstname.toLowerCase();
    //   const lastname = data[i].lastname.toLowerCase();
    //   const email = firstname + lastname + '@yahoo.com';
    //   const password = 'northumbria';

      this.isLoading = true;
      this.loadingCtrl.create({keyboardClose: true, message: this.isLogin ? 'Logging in....' : 'Signing up....' })
      .then(loadingEl => {
        loadingEl.present();
        const firstname = form.value.firstname;
        const lastname = form.value.lastname;
        const email = form.value.email;
        const password = form.value.password;
        let authObs: Observable<AuthResponseData>;

        if(!this.isLogin) {
          
          authObs = this.authService.signup(firstname, lastname, email, password);
        }
        else {
          authObs = this.authService.login(email, password);
        }    
        
        return authObs.subscribe(resData => {
          
          loadingEl.dismiss();
          this.isLoading = false;
          form.reset();
          this.isLogin ? this.router.navigateByUrl('/featured/tabs/stories') : this.showAlert('Account created. You can now log in');
          this.isLogin ? '' : this.isLogin = true;

        }, errorResponse => {
          loadingEl.dismiss();
          const errorCode = errorResponse.error.message;

          this.showAlert(errorCode);
          this.isLoading = false;
        });      
      });
            
  }  

  //Prepare alert message
  private showAlert(message: string) {
    this.alertCtrl.create({      
      message: message,
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

  //Toggle signup and login forms
  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }  

}
