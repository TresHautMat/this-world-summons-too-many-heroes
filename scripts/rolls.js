Hooks.once("ready", () => {
  console.log("Le système 'This World Summons Too Many Heroes!' est prêt !");
  
  // Attache les événements de clic sur les attributs de la feuille de personnage
  document.querySelectorAll('.attribute-roll').forEach(button => {
    button.addEventListener('click', onAttributeRoll);
  });
});

// Fonction de lancer de dés d'attribut
async function onAttributeRoll(event) {
  // Récupérer la valeur de l'attribut cliqué
  const attributeName = event.target.getAttribute('data-attribute');
  const attributeValue = parseInt(event.target.value);
  
  if (isNaN(attributeValue) || attributeValue <= 0) {
    ui.notifications.error(`L'attribut ${attributeName} doit être supérieur à 0 pour effectuer un lancer.`);
    return;
  }

  // Lance un nombre de D6 égal à la valeur de l'attribut
  const roll = new Roll(`d6`, {});
  roll.evaluate({ async: true });
  const diceResults = [];
  for (let i = 0; i < attributeValue; i++) {
    const result = await roll.roll();
    diceResults.push(result.total);
  }

  // Trouver le résultat le plus élevé
  const maxRoll = Math.max(...diceResults);
  
  // Evaluation du résultat
  let resultText = "Échec";
  if (maxRoll >= 3 && maxRoll <= 4) {
    resultText = "Réussite Partielle";
  } else if (maxRoll >= 5 && maxRoll <= 6) {
    resultText = "Réussite";
  }

  // Affichage du message
  const message = `${attributeName} : Lancer de ${attributeValue} dés - Résultat le plus élevé : ${maxRoll} (${resultText})`;
  ChatMessage.create({ content: message });
}
