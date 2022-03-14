// utility to check if an object has the required properties
// e.g., inputCheck(object, 'prop1', 'prop2', 'etc')

module.exports = function(obj, ...props) {
   const errors = [];

   // loop through each property of the array props
   props.forEach((prop) => {
      // if property is blank or doesn't exist, add to errors array
      if (obj[prop] === undefined || obj[prop] === '') {
         errors.push(`No ${prop} specified.`);
      }
   });
   
   // if the errors array has elements in it, then return the errors
   if (errors.length) {
      return {
         error: errors.join(' ')
      };
   }
   
   return null;
};

