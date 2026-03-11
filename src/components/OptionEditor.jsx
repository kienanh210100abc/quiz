import React from 'react'

const OptionEditor = ({ question, onChange, questionIndex }) => {
 const addOption = () => {

   const nextIndex = question.options.length + 1;
   const newOption = {
     value: `option_${questionIndex + 1}_${nextIndex}`,
     label: "",
     sortOrder: nextIndex
   };

   onChange({
     ...question,
     options: [...question.options, newOption]
   });
 };

 const updateOption = (optionIndex, updatedOption) => {
   const previousOption = question.options[optionIndex];
   const updatedOptions = question.options.map((option, index) =>
     index === optionIndex ? updatedOption : option
   );

   let updatedCorrectOptions = question.correctOptionValues;
   if (previousOption && previousOption.value !== updatedOption.value) {
     updatedCorrectOptions = updatedCorrectOptions.map((value) =>
       value === previousOption.value ? updatedOption.value : value
     );
   }

   const validOptionValues = new Set(updatedOptions.map((option) => option.value));
   updatedCorrectOptions = updatedCorrectOptions.filter((value) => validOptionValues.has(value));

   onChange({
     ...question,
     options: updatedOptions,
     correctOptionValues: updatedCorrectOptions,
   });
 };

 const removeOption = (optionIndex) => {
   const removedOption = question.options[optionIndex];

   const updatedOptions = question.options
     .filter((_, index) => index !== optionIndex)
     .map((option, index) => ({
       ...option,
       sortOrder: index + 1,
     }));

   onChange({
     ...question,
     options: updatedOptions,
     correctOptionValues: question.correctOptionValues.filter(
       (value) => value !== removedOption.value
     ),
   });
 };

 const toggleCorrectOption = (optionValue) => {
   const isSelected = question.correctOptionValues.includes(optionValue);
   const updatedCorrectOptions = isSelected
     ? question.correctOptionValues.filter((value) => value !== optionValue)
     : [...question.correctOptionValues, optionValue];

   onChange({
     ...question,
     correctOptionValues: updatedCorrectOptions,
   });
 };

 return (
   <div className="option-editor">
     <h4>Options</h4>

     {question.options.length === 0 ? (
       <p className="empty-state">No options yet.</p>
     ) : null}

     {question.options.map((option, index) => (
       <div key={`option-${index}`} className="option-row">
         <div className="option-row-top">
           <strong>Option {index + 1}</strong>
           <button
             type="button"
             className="danger-button"
             onClick={() => removeOption(index)}
           >
             Remove Option
           </button>
         </div>

         <label htmlFor={`option-value-${questionIndex}-${index}`}>Value</label>
         <input
           id={`option-value-${questionIndex}-${index}`}
           placeholder="Option Value"
           value={option.value}
           onChange={(e) =>
             updateOption(index, {
               ...option,
               value: e.target.value,
             })
           }
         />

         <label htmlFor={`option-label-${questionIndex}-${index}`}>Label</label>
         <input
           id={`option-label-${questionIndex}-${index}`}
           placeholder="Option Label"
           value={option.label}
           onChange={(e) =>
             updateOption(index, {
               ...option,
               label: e.target.value,
             })
           }
         />

         <label htmlFor={`option-order-${questionIndex}-${index}`}>Sort order</label>
         <input
           id={`option-order-${questionIndex}-${index}`}
           type="number"
           min="1"
           value={option.sortOrder}
           onChange={(e) =>
             updateOption(index, {
               ...option,
               sortOrder: Number(e.target.value),
             })
           }
         />

         <label className="checkbox-row" htmlFor={`option-correct-${questionIndex}-${index}`}>
           <input
             id={`option-correct-${questionIndex}-${index}`}
             type="checkbox"
             checked={question.correctOptionValues.includes(option.value)}
             onChange={() => toggleCorrectOption(option.value)}
           />
           Correct option
         </label>

       </div>
     ))}

     <button onClick={addOption}>
       Add Option
     </button>

   </div>
 );
}

export default OptionEditor
