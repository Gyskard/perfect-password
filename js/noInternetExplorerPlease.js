/*Affichage d'une alerte si le navigateur est Internet Explorer*/

/**
 * @return {number}
 */

function GetIEVersion() {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf("MSIE");
    if (Idx > 0) {
        return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
    }
    else if (!!navigator.userAgent.match(/Trident\/7\./)) {
        return 11;
    }
    else {
        return 0;
    }}

if (GetIEVersion() > 0)
    alert("Votre naviguateur (Internet Explorer " + GetIEVersion() + ") est obsolète, aucune compatibilité n'est garantie sur ce site.");