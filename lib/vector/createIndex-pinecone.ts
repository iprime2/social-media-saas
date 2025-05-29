// import { pinecone } from "./pinecone"; // Assuming this is set up with Pinecone API keys

// const createIndex = async (indexName: string) => {
//   try {
//     const indexExists = await pinecone.describeIndex(indexName).catch(() => false);
//     if (indexExists) {
//       console.log(`Index "${indexName}" already exists`);
//     } else {
//       console.log(`Creating index "${indexName}"`);
//       await pinecone.createIndex({
//         name: indexName,
//         dimension: 768, // Change to match your embedding dimension
//         metric: 'cosine', // Can use other metrics depending on your need
//         podType: 'p1', // Adjust based on your usage
//       });
//     }
//   } catch (error) {
//     console.error('Error creating index:', error);
//   }
// };
