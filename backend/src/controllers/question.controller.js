import { Question } from "../models/question.model.js";

const insertQuestion = async (req, res) => {
  console.log("req.difficulty, body: ", req.body);
  const { question, options, answer, difficulty, subject, chapter } = req.body;
  try {
    const questions = await Question.create({
      question,
      options,
      answer,
      difficulty,
      subject,
      chapter,
    });

    const createdQuestion = await Question.findById(questions._id);

    if (!createdQuestion) {
      throw new ApiError(
        500,
        "Something went wrong while inserting the question"
      );
    }

    return res.status(201).json({
      data: createdQuestion,
      message: "Question Inserted Successfully",
    });
  } catch (error) {
    console.log("Error is: ", error);
    return res.status(500).json({
      error,
      message: "Something went wrong while inserting question",
    });
  }
};

const fetchQuestion = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(201).json(questions);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export { insertQuestion, fetchQuestion };
