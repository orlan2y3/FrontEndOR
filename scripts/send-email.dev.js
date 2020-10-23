class sendEmail{
    
    constructor(){
        /**Api url desde la cual envaremos el correo*/
        this._url       = 'https://maicoltf.com/API/send_email.php';
        this._name      = '';
        this._email     = '';
        this._message   = '';
        /**Data a enviar por post */
        this._data      = {
            key : 'nZr4u7x!A%D*G-KaPdSgVkYp2s5v8y/B?E(H+MbQeThWmZq4t6w9z$C&F)J@NcRf', 
        };
    }
    
    /** Seteamos el nombre */
    name(name){
        this._name  = (typeof name !== "undefined") ? name.toString() : '' ;
        return this;
    }

     /** Seteamos el email */
    email(email){
        this._email  = (typeof email !== "undefined") ? email : '' ;
        return this;
    }
    
    /** Seteamos el mensaje */
    message(message){
        this._message  = (typeof message !== "undefined") ? message.toString() : '' ;
        return this;
    }

    /**Hacemos una validacion basica de los datos */
    _validar(){ 

        /**Para devolcer mensaje al usuario en la pag. */
        let res = {
            'status' : 0,
            'message' : 'Hay campos requeridos',
        };

        /**Mensajes de error a mostrar */
        const textName    = 'El nombre es requerido (Debe tener al menos 4 caracteres)';
        const textEmail   = 'Dirección de email incorrecta';
        const requiredClass = 'frm-required'; 

        /**Validacion basica para el email */
        var regexEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
        
        /**Obtenemos los datos del form */
        let formData = this.formData();

        /**Quitamos las clases de validacion */
        formData.name.removeClass(requiredClass);
        formData.email.removeClass(requiredClass);
 
        if(this._name == ""){
            /**Si el nombre esta vacio */
            formData.name.addClass(requiredClass).focus();
            res.message = textName; 
        }else if(this._email == '' || !regexEmail.test(this._email)){
            /**Si el email esta vacio */
            res.message = textEmail;
            formData.email.addClass(requiredClass).focus();
        }else{
            /**Si todo va bien */
            res.message = '';
            res.status = 200;
        }

        /**Seteamos la data llenada por el cliente */
        this._data.name = this._name;
        this._data.email = this._email;
        this._data.message = this._message;

        return res;
    }

    /**Hacemos el envio del correo */
    send(){
        let validar = this._validar();
        let clase = this;

        /**Aqui mostraremos el status del mensaje */
        const contentStatusMessage = $('.message-status');
        /**Capturamos el boton de enviar */
        const buttonSend    = $("#contactform").find('.btn-send-message');
        /**Removemos las clases*/
        const classToRemove = 'error sending sent';

        /**Si la data esta correcta */
        if(validar.status == 200){
            contentStatusMessage.removeClass(classToRemove);
            contentStatusMessage.addClass('sending')
                                .text('Enviando su email, por favor espere...')
                                .show();
            $.post(this._url, this._data, function(res){
                /**Si se envia el mensaje */
                if(res.status == 200){ 
                    contentStatusMessage.addClass('sent')
                                        .text('El email se envio correctamante')
                                        .show();
                    clase.formReset();
                }else{
                    /**res.message viene sel server, para notificar de que no se envio */
                    contentStatusMessage.addClass('error')
                                        .text(res.message)
                                        .show(); 
                }

                buttonSend.attr('disabled', false);
            });
        }else{
            contentStatusMessage.removeClass(classToRemove);
            buttonSend.attr('disabled', false);
            /**Cuando el cliente no ha completado el form correctamente */
            contentStatusMessage.addClass('error')
                                        .text(validar.message)
                                        .show(); 
        }
    }

    /**Limpiamos los datos del formulario */
    formReset(){
        $('.jackInTheBox').trigger('reset');
    }

    /**Para obtener los datos del formulario */
    formData(){
        let form    = $("#contactform");
        let name    = $(form).find('.name');
        let email   = $(form).find('.email');
        let message = $(form).find('.message');

        return { name, email, message }
    }

    /**Iniciamos el evento click */
    init(){

        let clase = this; // this = sendEmail
       
        $(".message-status ").on('click', function(){
            $(this).hide();
        });
        
        $("#contactform").find('.btn-send-message').off('click');
        $("#contactform").find('.btn-send-message').on('click', function(){
            $(this).attr('disabled', true);
            /**Obtenemos los datos del form 
             * Se declara la variable clase para ifualar al objeto, porque si dentro de este evento click hacemos "this", seria equivalente al elemento que se le este dando clicn y no a la clase js como tal
            */
            let formData = clase.formData();
            /**Seteamos las variables a enviar */
            clase.name(formData.name.val()).email(formData.email.val()).message(formData.message.val()).send();
        });
    }
}
  
/**Para inicializar el proceso de validacion y envio automaticamente */
$(document).ready(function(){
    var __envio__ = new sendEmail();
    __envio__.init();
});