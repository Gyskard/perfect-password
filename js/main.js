/*#################
  ### Variables ###
  #################*/

    //initialisation variables diverses
    var alphaMin, alphaMaj, dec, nbrSpec1, nbrSpec2, nbrSpec3, niveau, nbrCaract, scoreMaxTemp, ratio, entropie,
        loadCustom, choixBits, progressBar, bits;
    //sauvegarde du DOM
    var firstLoad = $('#first-load'), but1 = $('#but1'), but2 = $('#but2'), choixForce = $('#choixForce');
    //initilisation du mot de passe
    var password = "";
    //initilisation du nombre de bits nécessaires pour atteindre le niveau de force
    var scoreMax = 85;
    //initilisation des variables pour vérifier qu'une action a été effectué
    var toggle1 = false, toggle2 = false;
    //initilisation du tableau
    var tableau = [];
    //initilisation de la liste des caractères alphabéthiques
    var alphaList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s"]
        + ["t", "u", "v", "w", "x", "y", "z"];
    //initilisation de la liste des nombres spéciales 1
    var nbrSpec1List = ["!", "#", "$", "*", "%"];
    //initilisation de la liste des nombres spéciales 2
    var nbrSpec2List = ["?", "&", "[", "|", "]", "@", "^", "µ", ":", "/", ";", ".", ",", "<", ">"];
    //initilisation de la liste des nombres spéciales 3
    var nbrSpec3List = ["é", "è", "ë", "à", "â", "ç"]
;

/*####################################################################################
  ### Transformation du bouton "créer un nouveau mot de passe" en bouton principal ###
  ### et du bouton "guide" en bouton secondaire si ce n'est pas déjà le cas        ###
  ####################################################################################*/

function animate_menu() {
    //si l'animation n'a été encore effectué
    if (toggle1 === false) {
        //animation de "remonté" du texte
        $('#menu').animate({marginTop:'10em'},500,'swing');
        toggle1 = true;
    }
}

/*###########################################################################
  ### Calcul du nombre de possibilités de caractères pour le mot de passe ###
  ###########################################################################*/

function nombreCaracterePossible() {
    //remise à zéro des variables permettant de savoir quelle liste de caractères valides le mot de passe
    alphaMin = alphaMaj = dec = nbrSpec1 = nbrSpec2 = nbrSpec3 = false;
    //remise à zéro du tableau
    tableau = [];
    //remise à zéro du nombre de caractères possibles
    nbrCaract = 0;
    //transformation du mot de passe de string à arraw (tableau)
    for (var i=0; i<password.length; i++) {tableau.push(password[i])}
    //traitement du tableau en testant chaque liste de caractères
    $.map(tableau, function(el) {
        //lettre alphabétique minuscule
        if (alphaMin === false && $.inArray(el, alphaList) !== -1) {
            alphaMin = true;
            nbrCaract += 26
        }
        //lettre alphabétique majuscule
        if (alphaMaj === false && $.inArray(el, alphaList) === -1 && $.inArray(el.toLowerCase(), alphaList) !== -1) {
            alphaMaj = true;
            nbrCaract += 26
        }
        //nombres décimales
        if (dec === false && $.isNumeric(el) === true) {
            dec = true;
            nbrCaract += 10
        }
        //caractères spéciales 1
        if (nbrSpec1 === false && $.inArray(el, nbrSpec1List) !== -1) {
            nbrSpec1 = true;
            nbrCaract += 5
        }
        //caractères spéciales 2
        if (nbrSpec2 === false && $.inArray(el, nbrSpec2List) !== -1) {
            nbrSpec2 = true;
            nbrCaract += 15
        }
        //caractères spéciales 3
        if (nbrSpec3 === false && $.inArray(el, nbrSpec3List) !== -1) {
            nbrSpec3 = true;
            nbrCaract += 15
        }
    });
    //return du nombre de caractères
    return nbrCaract
}

/*###########################################
  ### Calcul de la force du mot de passe  ###
  ###########################################*/

function calculForce(nombreCaractere, taillePassword) {
    //return du calcul de l'entropie du mot de passe (ou force) à partir du nombre de caractères possibles et
    // de la taille du mot de passe
    return Math.round(Math.log(Math.pow(nombreCaractere, taillePassword)) / Math.log(2))
}

/*##############################################
  ### Affichage de la force du mot de passe  ###
  ##############################################*/

function force() {
    //sauvegarde de l'élement .progress-bar
    progressBar = $('.progress-bar');
    //sauvegarde de l'élement #bits
    bits = $('#bits');
    //appel de la fonction calculForce pour calculer de l'entropie du mot de passe (ou force) à partir du nombre de
    // caractères possibles et de la taille du mot de passe
    entropie = calculForce(nombreCaracterePossible(), password.length);
    //calcul de l'entropie en pourcentages
    ratio = Math.round(entropie) * (100 / scoreMax);
    //changement de largeur de la progress bar
    progressBar.css('width', ratio + '%');
    //si le pourcentage est inférieur ou égal à 33
    if (ratio <= 33) {
        //suppression des classes .bg-warning et .bg-success et ajoute de la classe .bg-danger
        progressBar.removeClass('bg-warning bg-success').addClass('bg-danger')
    }
    //sinon si le pourcentage est inférieur ou égal à 66
    else if (ratio <= 66) {
        //suppression des classes .bg-danger et .bg-success et ajoute de la classe .bg-warning
        progressBar.removeClass('bg-danger bg-success').addClass('bg-warning')
    }
    //sinon si le pourcentage est supérieur à 66
    else if (ratio > 66) {
        //suppression des classes .bg-danger et .bg-warning et ajoute de la classe .bg-success
        progressBar.removeClass('bg-danger bg-warning').addClass('bg-success')
    }
    //si le pourcentage est supérieur à 5
    if (ratio > 5) {
        //affichage du texte de la progress bar avec le nombre de bits du mot de passe
        bits.text(entropie + ' bits')
    }
    else {
        //suppression du texte de la progress bar
        bits.text('')
    }
}

/*#########################################################################################################
  ### Affichage d'une alerte en haut à droite de l'écran d'une certaine couleur avec un certain message ###
  #########################################################################################################*/

function alertInfo(message, type) {
    //ajout d'une alerte avec une balise div en haut à droite de l'écran avec une animation d'apparition pendant 1500ms
    // avec un message et un type d'alerte donné en paramètre
    $('<div>' + message + '</div>')
        .addClass('alert alert-' + type)
        .css({"position":"absolute", "right":"10px", "top":"10px", "opacity":"0"})
        .appendTo($('body'))
        .animate({opacity: "1"}, {duration: 'slow'}, setTimeout(function() {
            $('.alert').animate({opacity: "0"}, {duration: 'speed'})
        }, 1500))
}

/*####################################################################################
  ### Transformation du bouton "créer un nouveau mot de passe" en bouton principal ###
  ### et du bouton "guide" en bouton secondaire si ce n'est pas déjà le cas        ###
  ####################################################################################*/

but1.click(function () {
    //si but1 est un bouton secondaire
    if (but1.hasClass("btn-secondary"))
    {
        //passage de but1 en bouton primaire
        but1.removeClass('btn-secondary').addClass('btn-primary');
        //passage de but2 en bouton secondaire
        but2.removeClass('btn-primary').addClass('btn-secondary');
        //appel de la fonction animate_menu pour l'animation de "remonté"
        animate_menu();
        //chargement du fichier sec1.html (affichage de la section permettant le choix du niveau de force et
        // l'affichage de la progress bar et des boutons pour le choix du mot de passe)
        firstLoad.load('./data/sec1.html')
    }
});

/*#################################################################################
  ### Transformation du bouton "guide" en bouton  principal et du bouton "créer ###
  ### un nouveau mot de passe" en bouton secondaire si ce n'est pas déjà le cas ###
  #################################################################################*/

but2.click(function () {
    //si but2 est un bouton secondaire
    if (but2.hasClass("btn-secondary"))
    {
        //passage de but2 en bouton primaire
        but2.removeClass('btn-secondary').addClass('btn-primary');
        //passage de but1 en bouton secondaire
        but1.removeClass('btn-primary').addClass('btn-secondary');
        //appel de la fonction animate_menu pour l'animation de "remonté"
        animate_menu();
    }
});

/*###################################################################################################
  #### Insertion du mot de passe dans le presse-papier quand il y a un click sur le bouton "copy" ###
  ###################################################################################################*/

firstLoad.on('click', '#password', function (e) {
    //si l'élement cliqué dans l'élement de #password a #to-copy
    if (e.target.id !== 'to-copy') {
        //sélection du mot de passe
        $('#to-copy').select();
        //copie du mot de passe dans le presse-papier
        document.execCommand('copy');
        //appel de la fonction alertInfo pour afficher un message indiquant la copie dans le presse-papier
        alertInfo("Copier dans le presse-papier!", "info")
    }
});

/*########################################################################################################
  ### Détection d'un changement de niveau de force et récupération pour un changement non personnalisé ###
  ### et affichage d'un champ "niveau de force personnalisé" pour un changement personnalisé           ###
  ########################################################################################################*/

firstLoad.on('change', choixForce, function () {
    //sauvegarde de l'élement #loadCustom
    loadCustom = $('#loadCustom');
    //récupération du niveau de force choisit
    niveau = $('#niveauForce').val();
    //si l'input pour un niveau de force personnalisé n'est pas affiché
    if (toggle2 === false) {
        //si l'utilisateur demande un niveau de force personnalisé
        if (niveau === 'c') {
            //affichage de l'input pour un niveau de force personnalisé
            loadCustom.addClass('col').css({'opacity': '1', 'position': 'static'});
            //si un niveau de force personnalisé avait déjà été choisis par l'utilisateur avant
            if (scoreMaxTemp !== 0) {
                //application du score temporaire sur le score max (nombre de bits nécessaires pour valider le mot de
                // passe par rapport au niveau de force choisit par l'utilisateur
                scoreMax = scoreMaxTemp
            }
            //mise à true du toggle pour indiquer que l'input pour un niveau de force personnalisé a été affiché
            toggle2 = true
        }
        else {
            //sauvegarde du niveau de force
            scoreMax = niveau;
        }
    }
    //si l'input pour un niveau de force personnalisé est affiché
    else if (toggle2 === true) {
        //si le niveau de force n'est pas un niveau de force personnalisé
        if (niveau !== 'c') {
            //camouflage de l'input permettant de choisir un niveau de force personnalisé
            loadCustom.removeClass('col').css({'opacity':'0', 'position':'absolute'});
            //sauvegarde du niveau de force
            scoreMax = niveau;
            //mise à false du toggle pour indiquer que l'input un niveau de force personnalisé a été caché
            toggle2 = false;
        }
    }
    //appel de la fonction force pour la progress bar
    force()
});

/*##############################################################################
  ### Détection d'un changement dans le champ du mot de passe et récupération###
  ##############################################################################*/

firstLoad.on('change', '#to-copy', function() {
    //sauvegarde du mot de passe
    password = $(this).val();
    //appel de la fonction force pour la progress bar
    force()
});

/*##########################################################
  ### Détection d'un changement dans le champ "niveau de ###
  ### force personnalisé", vérification et récupération  ###
  ##########################################################*/

firstLoad.on('change', '#choixBits', function() {
    //sauvegarde de l'élement #choixBits
    choixBits = $('#choixBits');
    //sauvegarde du niveau de force (nombre de bits) choisis par l'utilisateur
    scoreMaxTemp = $(this).val();
    //si le nombre de bits n'est pas un entier
    if (scoreMaxTemp.indexOf('.') !== -1) {
        //appel de la fonction alertInfo pour envoyer un message indiquant que le nombre de bits doit être un entier
        alertInfo("Le nombre de bits doit être un entier!", "danger");
        //si l'input du niveau de force personnalisé n'est pas en rouge
        if (!(choixBits.hasClass("is-invalid"))) {
            //mise en rouge de l'input du niveau de force personnalisé
            choixBits.addClass("is-invalid")
        }
    }
    //si le nombre de bits est plus petit ou égal à 0
    else if (scoreMaxTemp <= 0) {
        //appel de la fonction alertInfo pour envoyer un message indiquant que le nombre de bits doit être supérieur à 1
        alertInfo("Le nombre de bits doit être supérieur à 0!", "danger");
        //si l'input du niveau de force n'est pas en rouge
        if (!(choixBits.hasClass("is-invalid"))) {
            //ajout de la classe .is-invalid sur l'input du niveau de force personnalisé
            choixBits.addClass("is-invalid")
        }
    }
    else {
        //sauvegarde du niveau de force demandé
        scoreMax = scoreMaxTemp;
        //si l'input du niveau de force personnalisé est en rouge
        if (choixBits.hasClass("form-control")) {
            //suppression de la classe .is-invalid de l'input du niveau de force personnalisé
            choixBits.removeClass("is-invalid");
        }
        //appel de la fonction force pour la progress bar
        force()
    }
});