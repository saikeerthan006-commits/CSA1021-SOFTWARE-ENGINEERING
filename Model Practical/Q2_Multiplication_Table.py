"""
CSA10 Software Engineering - Model Practical (Set 10)
Q2: RAPTOR Flowchart Logic & Implementation - Multiplication Table of a Number (1 to 10)
Author: M. Keerthan (1925260006)
"""

def run_multiplication_table(n: int, limit: int = 10) -> list[str]:
    """
    Executes the exact RAPTOR flowchart loop logic:
    1. Start
    2. Input: GET n ("Enter a number: ")
    3. Assignment: i <- 1
    4. Loop Condition (Exit when i > 10):
       - Assignment: result <- n * i
       - Output: PUT n + " x " + i + " = " + result
       - Assignment: i <- i + 1
    5. End
    """
    output_lines = []
    i = 1
    while not (i > limit):
        result = n * i
        line = f"{n} \u00d7 {i} = {result}"
        output_lines.append(line)
        i = i + 1
    return output_lines

if __name__ == "__main__":
    test_inputs = [7, 12]
    for val in test_inputs:
        print(f"--- RAPTOR MasterConsole Output (Input n = {val}) ---")
        for row in run_multiplication_table(val):
            print(row)
        print("----Run complete. 10 symbols evaluated.----\n")
