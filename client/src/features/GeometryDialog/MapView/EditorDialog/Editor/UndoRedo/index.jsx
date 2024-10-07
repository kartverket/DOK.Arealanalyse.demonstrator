import _UndoRedo from 'ol-ext/interaction/UndoRedo';
import styles from '../Editor.module.scss';
import { getLayer } from 'utils/map';
import { useEffect } from 'react';
import { getInteraction } from '../helpers';

export default function UndoRedo({ map }) {
   const name = UndoRedo.interactionName;

   function undo() {
      const interaction = getInteraction(map, name);
      interaction.undo();
   }

   function redo() {
      const interaction = getInteraction(map, name);
      interaction.redo();
   }

   return (
      <>
         <button className={styles.undo} onClick={undo} title="Angre"></button>
         <button className={styles.redo} onClick={redo} title="Gjør om"></button>
      </>
   );
}

UndoRedo.interactionName = 'undoRedo';

UndoRedo.addInteraction = map => {
   if (getInteraction(map, UndoRedo.interactionName) !== null) {
      return;
   }

   const vectorLayer = getLayer(map, 'features');
   const interaction = new _UndoRedo({ layers: [vectorLayer] });

   interaction.on('undo', event => {
      console.log(event);
   });

   interaction.on('redo', event => {
      console.log(event);
   });

   interaction.set('_name', UndoRedo.interactionName);
   interaction.setActive(true);

   map.addInteraction(interaction);
};