import pandas as pd
from transformers import pipeline
import math
import time

# --- DeepSeek Model Configuration ---
pipe = pipeline("text-generation", model="deepseek-ai/DeepSeek-R1", trust_remote_code=True)

# --- Constants ---
FILE_PATH = "professors_data.csv"
BATCH_SIZE = 1000  # Number of rows to process in each chunk

def process_chunk(df_chunk, user_query):
    """Processes a single chunk of the DataFrame."""
    dataset_text = df_chunk.to_csv(index=False)
    prompt = f"""
    You are an expert academic advisor. Analyze the following subset of professor data based on the user's query.
    Identify the top 2 most relevant professors from this list.

    User Query: "{user_query}"

    Dataset Chunk:
    {dataset_text}

    Your Task:
    - Select the top 2 most relevant professors from this chunk.
    - Provide a concise justification (under 20 words) for each.
    - Return the response in a structured format:
      Professor Name | Institution | h-index | i10-index | Citations | Justification
    """
    messages = [
        {"role": "user", "content": prompt}
    ]
    response = pipe(messages, max_new_tokens=512)[0]["generated_text"]
    return response.strip()

def main():
    """
    Main function to run the professor recommendation script.
    """
    print("--- Professor Recommendation Script (DeepSeek) ---")

    try:
        df = pd.read_csv(FILE_PATH)
        print(f"Successfully loaded '{FILE_PATH}' with {len(df)} rows.")
    except FileNotFoundError:
        print(f"Error: The file '{FILE_PATH}' was not found.")
        return

    user_query = input("Enter your research query (e.g., 'Generative AI and LLMs'): ")

    if not user_query.strip() or df.empty:
        print("Warning: Query is empty or the dataset is empty. Exiting.")
        return

    num_batches = math.ceil(len(df) / BATCH_SIZE)
    all_chunk_responses = []

    print(f"\nProcessing data in {num_batches} chunks...")
    for i in range(num_batches):
        start_idx = i * BATCH_SIZE
        end_idx = start_idx + BATCH_SIZE
        df_chunk = df.iloc[start_idx:end_idx]
        
        print(f"  - Processing chunk {i+1}/{num_batches}...")
        chunk_response = process_chunk(df_chunk, user_query)
        all_chunk_responses.append(chunk_response)
        time.sleep(2) # Add a small delay to avoid hitting per-second limits

    print("\nAll chunks processed. Aggregating results...")

    # Final aggregation prompt
    aggregated_prompt = f"""
    From the following lists of professor recommendations, select the top 4 most relevant professors overall.
    Ensure the final output is clean and follows the specified format. Keep justifications concise.

    Combined Recommendations:
    {"\n\n".join(all_chunk_responses)}

    Final Ranked List (Top 4):
    Return the final list in this format, with no header:
    Professor Name | Institution | h-index | i10-index | Citations | Justification
    """
    messages = [
        {"role": "user", "content": aggregated_prompt}
    ]
    final_response = pipe(messages, max_new_tokens=512)[0]["generated_text"]
    
    print("\n--- AI-Generated Recommendations ---")
    print(final_response)
    print("------------------------------------")

if __name__ == "__main__":
    main()