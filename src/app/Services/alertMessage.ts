export const AlertShowMessage = (alertType:any) =>{
    if (document.querySelector('.js-alert')) {
      const element = document.querySelector('.js-alert');
      element?.classList.add('show');
      element?.classList.add(alertType);
      setTimeout(() =>{
        element?.classList.remove('show')
      }, 2000);
    }
}

// Alertype peut etre soit "alert-success" ou alert-danger ou alert-warnig.

// 1. La methode permet de recuperer l'element html qui a la class js-alert (ça sera une alert boostrap)
// 2. Elle ajoute la classe "show" et la classe qui sera definie par le paramettre alertType au niveau de l'element pour permettre l'affichage de l'alert
// 3. Ensuite, apres 2 secondes, la classe "show" sera supprimée pour que l'alerte ne s'affiche plus