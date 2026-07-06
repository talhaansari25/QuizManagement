-- Insert quiz with description if not exists
INSERT INTO quizzes (title, description, time_limit_minutes, total_marks, passing_marks, negative_marking, negative_mark_value, is_active, created_by, created_at, updated_at)
SELECT 'Java Fundamentals Quiz', 'Test your knowledge of Java programming basics including variables, data types, operators, control flow, OOP concepts, collections, exception handling, and more.', 30, 20.0, 8.0, true, 0.25, true, 1, NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM quizzes WHERE title = 'Java Fundamentals Quiz');

-- Get quiz id
SET @quiz_id = (SELECT id FROM quizzes WHERE title = 'Java Fundamentals Quiz' LIMIT 1);

-- Question 1
INSERT INTO questions (question_text, marks, correct_key, quiz_id)
SELECT 'What is the default value of an int variable in Java?', 2.0, 'A', @quiz_id FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'What is the default value of an int variable in Java?' AND quiz_id = @quiz_id);
SET @q1 = (SELECT id FROM questions WHERE question_text = 'What is the default value of an int variable in Java?' AND quiz_id = @quiz_id);
INSERT INTO options (option_key, option_text, question_id) SELECT 'A', '0', @q1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q1 AND option_key = 'A');
INSERT INTO options (option_key, option_text, question_id) SELECT 'B', 'null', @q1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q1 AND option_key = 'B');
INSERT INTO options (option_key, option_text, question_id) SELECT 'C', 'undefined', @q1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q1 AND option_key = 'C');
INSERT INTO options (option_key, option_text, question_id) SELECT 'D', '-1', @q1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q1 AND option_key = 'D');

-- Question 2
INSERT INTO questions (question_text, marks, correct_key, quiz_id)
SELECT 'Which keyword is used to inherit a class in Java?', 2.0, 'B', @quiz_id FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'Which keyword is used to inherit a class in Java?' AND quiz_id = @quiz_id);
SET @q2 = (SELECT id FROM questions WHERE question_text = 'Which keyword is used to inherit a class in Java?' AND quiz_id = @quiz_id);
INSERT INTO options (option_key, option_text, question_id) SELECT 'A', 'implements', @q2 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q2 AND option_key = 'A');
INSERT INTO options (option_key, option_text, question_id) SELECT 'B', 'extends', @q2 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q2 AND option_key = 'B');
INSERT INTO options (option_key, option_text, question_id) SELECT 'C', 'inherits', @q2 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q2 AND option_key = 'C');
INSERT INTO options (option_key, option_text, question_id) SELECT 'D', 'super', @q2 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q2 AND option_key = 'D');

-- Question 3
INSERT INTO questions (question_text, marks, correct_key, quiz_id)
SELECT 'What is the size of int data type in Java?', 2.0, 'C', @quiz_id FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'What is the size of int data type in Java?' AND quiz_id = @quiz_id);
SET @q3 = (SELECT id FROM questions WHERE question_text = 'What is the size of int data type in Java?' AND quiz_id = @quiz_id);
INSERT INTO options (option_key, option_text, question_id) SELECT 'A', '16 bits', @q3 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q3 AND option_key = 'A');
INSERT INTO options (option_key, option_text, question_id) SELECT 'B', '8 bits', @q3 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q3 AND option_key = 'B');
INSERT INTO options (option_key, option_text, question_id) SELECT 'C', '32 bits', @q3 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q3 AND option_key = 'C');
INSERT INTO options (option_key, option_text, question_id) SELECT 'D', '64 bits', @q3 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q3 AND option_key = 'D');

-- Question 4
INSERT INTO questions (question_text, marks, correct_key, quiz_id)
SELECT 'Which method is the entry point of a Java application?', 2.0, 'A', @quiz_id FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'Which method is the entry point of a Java application?' AND quiz_id = @quiz_id);
SET @q4 = (SELECT id FROM questions WHERE question_text = 'Which method is the entry point of a Java application?' AND quiz_id = @quiz_id);
INSERT INTO options (option_key, option_text, question_id) SELECT 'A', 'main()', @q4 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q4 AND option_key = 'A');
INSERT INTO options (option_key, option_text, question_id) SELECT 'B', 'start()', @q4 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q4 AND option_key = 'B');
INSERT INTO options (option_key, option_text, question_id) SELECT 'C', 'init()', @q4 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q4 AND option_key = 'C');
INSERT INTO options (option_key, option_text, question_id) SELECT 'D', 'run()', @q4 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q4 AND option_key = 'D');

-- Question 5
INSERT INTO questions (question_text, marks, correct_key, quiz_id)
SELECT 'What is JVM?', 2.0, 'D', @quiz_id FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'What is JVM?' AND quiz_id = @quiz_id);
SET @q5 = (SELECT id FROM questions WHERE question_text = 'What is JVM?' AND quiz_id = @quiz_id);
INSERT INTO options (option_key, option_text, question_id) SELECT 'A', 'Java Very Large Memory', @q5 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q5 AND option_key = 'A');
INSERT INTO options (option_key, option_text, question_id) SELECT 'B', 'Java Variable Machine', @q5 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q5 AND option_key = 'B');
INSERT INTO options (option_key, option_text, question_id) SELECT 'C', 'Java Verified Machine', @q5 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q5 AND option_key = 'C');
INSERT INTO options (option_key, option_text, question_id) SELECT 'D', 'Java Virtual Machine', @q5 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q5 AND option_key = 'D');

-- Question 6
INSERT INTO questions (question_text, marks, correct_key, quiz_id)
SELECT 'Which of the following is not a primitive data type in Java?', 2.0, 'D', @quiz_id FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'Which of the following is not a primitive data type in Java?' AND quiz_id = @quiz_id);
SET @q6 = (SELECT id FROM questions WHERE question_text = 'Which of the following is not a primitive data type in Java?' AND quiz_id = @quiz_id);
INSERT INTO options (option_key, option_text, question_id) SELECT 'A', 'int', @q6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q6 AND option_key = 'A');
INSERT INTO options (option_key, option_text, question_id) SELECT 'B', 'boolean', @q6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q6 AND option_key = 'B');
INSERT INTO options (option_key, option_text, question_id) SELECT 'C', 'char', @q6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q6 AND option_key = 'C');
INSERT INTO options (option_key, option_text, question_id) SELECT 'D', 'String', @q6 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q6 AND option_key = 'D');

-- Question 7
INSERT INTO questions (question_text, marks, correct_key, quiz_id)
SELECT 'What is the default value of a boolean variable in Java?', 2.0, 'B', @quiz_id FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'What is the default value of a boolean variable in Java?' AND quiz_id = @quiz_id);
SET @q7 = (SELECT id FROM questions WHERE question_text = 'What is the default value of a boolean variable in Java?' AND quiz_id = @quiz_id);
INSERT INTO options (option_key, option_text, question_id) SELECT 'A', 'true', @q7 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q7 AND option_key = 'A');
INSERT INTO options (option_key, option_text, question_id) SELECT 'B', 'false', @q7 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q7 AND option_key = 'B');
INSERT INTO options (option_key, option_text, question_id) SELECT 'C', 'null', @q7 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q7 AND option_key = 'C');
INSERT INTO options (option_key, option_text, question_id) SELECT 'D', '0', @q7 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q7 AND option_key = 'D');

-- Question 8
INSERT INTO questions (question_text, marks, correct_key, quiz_id)
SELECT 'Which collection class allows duplicate elements?', 2.0, 'A', @quiz_id FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'Which collection class allows duplicate elements?' AND quiz_id = @quiz_id);
SET @q8 = (SELECT id FROM questions WHERE question_text = 'Which collection class allows duplicate elements?' AND quiz_id = @quiz_id);
INSERT INTO options (option_key, option_text, question_id) SELECT 'A', 'ArrayList', @q8 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q8 AND option_key = 'A');
INSERT INTO options (option_key, option_text, question_id) SELECT 'B', 'HashSet', @q8 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q8 AND option_key = 'B');
INSERT INTO options (option_key, option_text, question_id) SELECT 'C', 'TreeSet', @q8 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q8 AND option_key = 'C');
INSERT INTO options (option_key, option_text, question_id) SELECT 'D', 'LinkedHashSet', @q8 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q8 AND option_key = 'D');

-- Question 9
INSERT INTO questions (question_text, marks, correct_key, quiz_id)
SELECT 'What does the final keyword mean when applied to a variable?', 2.0, 'C', @quiz_id FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'What does the final keyword mean when applied to a variable?' AND quiz_id = @quiz_id);
SET @q9 = (SELECT id FROM questions WHERE question_text = 'What does the final keyword mean when applied to a variable?' AND quiz_id = @quiz_id);
INSERT INTO options (option_key, option_text, question_id) SELECT 'A', 'Variable can be overridden', @q9 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q9 AND option_key = 'A');
INSERT INTO options (option_key, option_text, question_id) SELECT 'B', 'Variable is static', @q9 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q9 AND option_key = 'B');
INSERT INTO options (option_key, option_text, question_id) SELECT 'C', 'Variable value cannot be changed', @q9 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q9 AND option_key = 'C');
INSERT INTO options (option_key, option_text, question_id) SELECT 'D', 'Variable is private', @q9 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q9 AND option_key = 'D');

-- Question 10
INSERT INTO questions (question_text, marks, correct_key, quiz_id)
SELECT 'Which exception is thrown when an array is accessed with an invalid index?', 2.0, 'B', @quiz_id FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM questions WHERE question_text = 'Which exception is thrown when an array is accessed with an invalid index?' AND quiz_id = @quiz_id);
SET @q10 = (SELECT id FROM questions WHERE question_text = 'Which exception is thrown when an array is accessed with an invalid index?' AND quiz_id = @quiz_id);
INSERT INTO options (option_key, option_text, question_id) SELECT 'A', 'NullPointerException', @q10 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q10 AND option_key = 'A');
INSERT INTO options (option_key, option_text, question_id) SELECT 'B', 'ArrayIndexOutOfBoundsException', @q10 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q10 AND option_key = 'B');
INSERT INTO options (option_key, option_text, question_id) SELECT 'C', 'ClassCastException', @q10 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q10 AND option_key = 'C');
INSERT INTO options (option_key, option_text, question_id) SELECT 'D', 'ArithmeticException', @q10 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM options WHERE question_id = @q10 AND option_key = 'D');

