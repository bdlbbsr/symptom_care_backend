const Symptom = require('../models/Symptom');

// Define a list of common prepositions to exclude
const prepositions = ['in', 'on', 'the', 'at', 'for', 'with', 'by', 'of', 'to', 'from', 'about', 'as', 'and', 'but', 'or', 'so', 'nor', 'my'];

const searchSymptoms = async (req, res) => {
  try {
    const { query } = req.body;

    // Split the query into individual words and filter out prepositions
    const words = query.split(' ')
      .map(word => word.trim().toLowerCase())
      .filter(word => word.length > 0 && !prepositions.includes(word));

    if (words.length === 0) {
      return res.json({ message: 'Please enter at least one valid word to search.' });
    }

    // Create patterns for both singular and plural forms
    const pluralizedWords = words.map(word => `(${word}s?|${word.slice(0, -1)}s?)`);
    const regexPatterns = pluralizedWords.map(pattern => new RegExp(`\\b${pattern}\\b`, 'i'));

    // Combine all patterns to create a single search pattern
    const combinedPattern = new RegExp(regexPatterns.map(r => r.source).join('|'), 'i');

    const results = await Symptom.aggregate([
      {
        $match: {
          $text: { $search: query }
        }
      },
      {
        $addFields: {
          score: { $meta: 'textScore' }
        }
      }
    ]);

    if (results.length === 0) {
      return res.json({
        message: 'No data found. Please post your symptom anonymously to receive detailed information from experienced doctors worldwide.'
      });
    }

    // Filter results based on the number of words entered by the user
    const filteredResults = results.filter(result => {
      // Count the number of words that match the pattern in the result description
      const matchCount = regexPatterns.reduce((count, regex) => {
        return count + (regex.test(result.description) ? 1 : 0);
      }, 0);
      
      // If the user entered two or more words, ensure that at least two words are matched
      if (words.length > 1) {
        return matchCount >= 2;
      }

      // If the user entered only one word, return results that match at least one word
      return matchCount >= 1;
    });

    // Sort results by the number of matched words and then by text score
    const sortedResults = filteredResults.sort((a, b) => {
      const aMatchCount = regexPatterns.reduce((count, regex) => {
        return count + (regex.test(a.description) ? 1 : 0);
      }, 0);
      const bMatchCount = regexPatterns.reduce((count, regex) => {
        return count + (regex.test(b.description) ? 1 : 0);
      }, 0);

      if (bMatchCount !== aMatchCount) {
        return bMatchCount - aMatchCount;
      } else {
        return b.score - a.score;
      }
    });

    res.json({ data: sortedResults });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  searchSymptoms
};
















// const Symptom = require('../models/Symptom');

// const searchSymptoms = async (req, res) => {
//   try {
//     const { query } = req.body;

//     // Split the query into individual words
//     const words = query.split(' ').filter(word => word.trim().length > 0);

//     if (words.length === 0) {
//       return res.json({ message: 'Please enter at least one word to search.' });
//     }

//     // Create patterns for both singular and plural forms
//     const pluralizedWords = words.map(word => `(${word}s?|${word.slice(0, -1)}s?)`);
//     const regexPatterns = pluralizedWords.map(pattern => new RegExp(`\\b${pattern}\\b`, 'i'));

//     // Filter results based on the number of words entered by the user
//     const results = await Symptom.aggregate([
//       {
//         $match: {
//           $text: { $search: query }
//         }
//       },
//       {
//         $addFields: {
//           score: { $meta: 'textScore' }
//         }
//       }
//     ]);

//     if (results.length === 0) {
//       return res.json({
//         message: 'No data found. Please post your symptom anonymously to receive detailed information from experienced doctors worldwide.'
//       });
//     }

//     const filteredResults = results.filter(result => {
//       // Count the number of words that match the pattern in the result description
//       const matchCount = regexPatterns.reduce((count, regex) => {
//         return count + (regex.test(result.description) ? 1 : 0);
//       }, 0);
      
//       // If the user entered two or more words, ensure that at least two words are matched
//       if (words.length > 1) {
//         return matchCount >= 2;
//       }

//       // If the user entered only one word, return results that match at least one word
//       return matchCount >= 1;
//     });

//     // Sort results by the number of matched words and then by text score
//     const sortedResults = filteredResults.sort((a, b) => {
//       const aMatchCount = regexPatterns.reduce((count, regex) => {
//         return count + (regex.test(a.description) ? 1 : 0);
//       }, 0);
//       const bMatchCount = regexPatterns.reduce((count, regex) => {
//         return count + (regex.test(b.description) ? 1 : 0);
//       }, 0);

//       if (bMatchCount !== aMatchCount) {
//         return bMatchCount - aMatchCount;
//       } else {
//         return b.score - a.score;
//       }
//     });

//     res.json({ data: sortedResults });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   searchSymptoms
// };













// const Symptom = require('../models/Symptom');

// const searchSymptoms = async (req, res) => {
//   try {
//     const { query } = req.body;

//     const results = await Symptom.aggregate([
//       {
//         $match: {
//           $text: { $search: query }
//         }
//       },
//       {
//         $addFields: {
//           score: { $meta: 'textScore' }
//         }
//       },
//       {
//         $sort: {
//           score: { $meta: 'textScore' }
//         }
//       }
//     ]);

//     if (results.length === 0) {
//       return res.json({
//         message:
//           'No data found. Please post your symptom anonymously to receive detailed information from experienced doctors worldwide.'
//       });
//     }

//     res.json({ data: results });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   searchSymptoms
// };
