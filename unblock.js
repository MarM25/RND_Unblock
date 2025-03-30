function findClassesWithSubstring(substring) {
    let allElements = document.querySelectorAll("*"); // Alle Elemente im DOM abrufen
    let matchingClasses = new Set(); // Set für eindeutige Klassennamen

    allElements.forEach(element => {
        element.classList.forEach(className => {
            if (className.includes(substring)) {
                matchingClasses.add(className);
            }
        });
    });

    return Array.from(matchingClasses); // Als Array zurückgeben
}

function getMagicClass(element) {
    if (!element || !element.classList.length) return; // Falls das Element keine Klassen hat, abbrechen

    let classList = element.classList;
    console.log(classList);
    let lastClass = classList[classList.length - 1]; // Letzte Klasse holen
    //console.log(lastClass);
    classList.remove(lastClass); // Letzte Klasse entfernen
    return classList[1];
}

function extractFusionJSON() {
    let html = document.documentElement.innerHTML; // Gesamten HTML-Inhalt als String holen
    let match = html.match(/Fusion\.globalContent=\{.*?\};/s); // JSON mit regulärem Ausdruck suchen

    if (match) {
        let jsonString = match[0].replace("Fusion.globalContent=", "").slice(0, -1); // "Fusion.globalContent=" entfernen und letztes ";" abschneiden
        try {
            return JSON.parse(jsonString); // In JSON umwandeln
        } catch (e) {
            console.error("Fehler beim Parsen des JSON:", e);
            return null;
        }
    }
    return null; // Falls nichts gefunden wurde
}

function remove_paywall(json_data){
    if (json_data == null || !("elements" in json_data))
        return

    // Make Introtext readable
    paywalls_header = findClassesWithSubstring("ArticleHeadstyled__ArticleSubHeadline");
    if (paywalls_header.length == 0)
        return;


    element = document.getElementsByClassName(paywalls_header[0])[0]
    magic_class = getMagicClass(element);
    element.innerText = "<b>" + element.innerHTML + "</b>"

    json_data_filtered = json_data.elements.filter(function (el){
        if (el.type === "text" || el.type === "header")
            return el
    });

    full_text = ""
    for (const item of json_data_filtered) {
        if (item.type === "header")
            full_text += "<h2 class='Headlinestyled__Headline-sc-mamptc-0 ceLWQu' data-testid='headline'><span><b>" + item.text + "</b></span></h2>"
        if (item.type === "text")
            full_text += "<p class='Textstyled__Text-sc-1cqv9mi-0 " + magic_class + "'>" + item.text + "</p></br>"
    } 
    
    // Remove Paywall Element
    paywalls = findClassesWithSubstring("Articlestyled__FullscreenPaywallScrollContainer");
    if (paywalls.length !=0){
        document.querySelectorAll("." + paywalls[0]).forEach(el => el.remove());
    }
    
    // Find Text-Div
    text_divs_class_elements = findClassesWithSubstring("Articlestyled__CenteredContentWrapper");
    last_text_div = document.getElementsByClassName(text_divs_class_elements[0])[0];
    replace_div = document.createElement("div");
    replace_div.innerText = full_text
    last_text_div.appendChild(replace_div);
}

function kick_it(){
    var json_data = extractFusionJSON(document.documentElement.innerHTML);
    setTimeout(() => {  remove_paywall(json_data); }, 1000);
}
kick_it();
