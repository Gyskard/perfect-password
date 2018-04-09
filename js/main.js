/*#################
  ### Variables ###
  #################*/

//initilisation de variables diverses
var password, alphaMin, alphaMaj, dec, nbrSpec1, nbrSpec2, nbrSpec3, tableau, niveau, scoreRatio;
var nbrCaract, score = 0;
//variable pour savoir si l'animation de remontée a été effectué ou non
var toggle1 = toggle2 = false;
//application d'un nombre de bits minimum par défaut (niveau de force moyen)
var scoreMax = 85;
//liste alphabétique
var alphaList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
                 "u", "v", "w", "x", "y", "z"];
//liste caractères spéciaux 1
var nbrSpec1List = ["!", "#", "$", "*", "%"];
//liste caractères spéciaux 2
var nbrSpec2List = ["?", "&", "[", "|", "]", "@", "^", "µ", ":", "/", ";", ".", ",", "<", ">"];
//liste caractères spéciaux 3
var nbrSpec3List = ["é", "è", "ë", "à", "â", "ç"];

/*####################################################################################
  ### Transformation du bouton "créer un nouveau mot de passe" en bouton principal ###
  ### et du bouton "guide" en bouton secondaire si ce n'est pas déjà le cas        ###
  ####################################################################################*/

function animate_menu() {
    if (toggle1 === false) {
        $('#menu').animate({marginTop:'10em'},500,'swing');
        toggle1 = true;
    }
}

/*############################################################################
  ### Modification de la progress bar en fonction de l'entropie du mot de  ###
  ### passe par rapport à la valeur maximal demandé par le niveau de force ###
  ############################################################################*/

function modif_bar() {
    //calcul de l'entropie en bits
    score = Math.round(Math.log(Math.pow(nbrCaract, tableau.length)) / Math.log(2));
    //transformation du calcul en %
    scoreRatio = score * (100 / scoreMax);
    if (scoreRatio <= 33) {
        $('#bar-force') .css('width', scoreRatio + '%')
                        .removeClass('bg-warning bg-success')
                        .addClass('bg-danger')
    }
    else if (scoreRatio <= 66) {
        $('#bar-force') .css('width', scoreRatio + '%')
            .removeClass('bg-danger bg-success')
            .addClass('bg-warning')
    }
    else if (scoreRatio > 66) {
        $('#bar-force') .css('width', scoreRatio + '%')
            .removeClass('bg-danger bg-warning')
            .addClass('bg-success')
    }
    //application du % sur la barre
    //non visualisation du nombre de bits (pas assez de place)
    if (scoreRatio < 3) {
        $('#bits').text('')
    }
    //visualisation du nombre de bits
    else {
        $('#bits').text(score + ' bits')
    }
}

/*####################################################################################
  ### Transformation du bouton "créer un nouveau mot de passe" en bouton principal ###
  ### et du bouton "guide" en bouton secondaire si ce n'est pas déjà le cas        ###
  ####################################################################################*/

$('#but1').click(function () {
    //détection du bouton secondaire
    if ($(this).hasClass("btn-secondary"))
    {
        //mise en bouton principal
        $(this).removeClass('btn-secondary').addClass('btn-primary');
        //mise de l'autre bouton en secondaire
        $('#but2').removeClass('btn-primary').addClass('btn-secondary');
        //animation de remontée
        animate_menu()
    }
});

/*#################################################################################
  ### Transformation du bouton "guide" en bouton  principal et du bouton "créer ###
  ### un nouveau mot de passe" en bouton secondaire si ce n'est pas déjà le cas ###
  #################################################################################*/

$('#but2').click(function () {
    //détection du bouton secondaire
    if ($(this).hasClass("btn-secondary"))
    {
        //mise en bouton principal
        $(this).removeClass('btn-secondary').addClass('btn-primary');
        //mise de l'autre bouton en secondaire
        $('#but1').removeClass('btn-primary').addClass('btn-secondary');
        //animation de remontée
        animate_menu()
    }
});

/*###################################################################################################
  #### Insertion du mot de passe dans le presse-papier quand il y a un click sur le bouton "copy" ###
  ###################################################################################################*/

$('#copy').click(function () {
    //récupération du mot de passe
    $('#to-copy').select();
    //mise dans le presse-papier
    document.execCommand('copy');
    //alerte indiquant la copie dans le presse-papier
    $('<div>Copié dans le presse-papier!</div>')
        .addClass('alert alert-warning')
        .css({"position":"absolute", "right":"10px", "top":"10px", "opacity":"0"})
        .appendTo($('body'))
        .animate({opacity: "1"}, {duration: 'slow'}, setTimeout(function() {
            $('.alert').animate({opacity: "0"}, {duration: 'speed'})
        }, 1200))
});

/*###########################################################################################
  #### Application d'un score maximal au nombre de bits nécessaires par rapport au niveau ###
  #### de force demandé à la détection d'un changement dans le champ de niveau de force   ###
  ###########################################################################################*/

$('#niveauForce').change(function () {
    //récupération du niveau de force
    niveau = ($('#niveauForce').val());
    //application du nombre de bits maximum demandé
    if (niveau === "1") {
        scoreMax = 49
    }
    if (niveau === "2") {
        scoreMax = 78
    }
    if (niveau === "3") {
        scoreMax = 85
    }
    if (niveau === "4") {
        scoreMax = 130
    }
    if (niveau === "5") {
        if (toggle2 === false) {
            $('<form id="customCaractere"><div class="input-group mb-3"><input type="text" class="form-control">' +
            '</div></form>').appendTo($('#choixForce'));
            toggle2 = true
        }
    }
    else if (toggle2 === true) {
        $('#customCaractere').remove();
        toggle2 = false
    }
    modif_bar()
});

/*#####################################################################################################
  #### Modification de la progress bar à la détection d'un changement dans le champ du mot de passe ###
  #####################################################################################################*/

$('#to-copy').change(function () {
    //récupération du mot de passe
    password = $('#to-copy').val();
    //remise à zéro du tableau ou création
    tableau = [];
    //insertion du mot de passe dans le tableau (1 caractère par cellule)
    for (var i=0; i<password.length; i++) {tableau.push(password[i])}
    //(re)mise en false de toutes les possibilités
    alphaMin = alphaMaj = dec = nbrSpec1 = nbrSpec2 = nbrSpec3 = false;
    //(re)mise à zéro du nombre de caractères possibles
    nbrCaract = 0;
    //comptage du nombre de types de caractères possibles
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
    modif_bar()
});