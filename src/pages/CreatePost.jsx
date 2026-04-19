import { useState } from 'react'
import './CreatePost.css'
import { supabase } from '../client';

const CreatePost = () => {

    const [post, setPost] = useState({ title: "", author: "", description: "" })
    const [isGenerating, setIsGenerating] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target
        setPost((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const LLM_API_KEY = import.meta.env.VITE_LLM_API_KEY;
    const LLM_ENDPOINT = import.meta.env.VITE_LLM_ENDPOINT;

    const createPost = async (event) => {
        event.preventDefault();
        setIsGenerating(true);

        try {
            // 1. Call the LLM
            const response = await fetch(LLM_ENDPOINT + 'api/v1/messages', {
                method: "POST",
                body: JSON.stringify({
                    model: "openai/gemma4:26b", 
                    messages: [
                        {
                            role: "user",
                            content: `Analyze this Gen Z challenge: "${post.description}". 
                        Provide a spiciness rating (1-10) and a one-word category. 
                        Respond ONLY in JSON format: {"rating": number, "category": "string"}`,
                        }
                    ]
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${LLM_API_KEY}`,
                },
            });

            let aiResult = await response.json();
            aiResult = aiResult["content"][0]["text"];

            // Clean and parse the JSON string
            let cleanJson = aiResult.trim();
            if (cleanJson.startsWith("```")) cleanJson = cleanJson.slice(3);
            if (cleanJson.startsWith("json")) cleanJson = cleanJson.slice(4);
            if (cleanJson.endsWith("```")) cleanJson = cleanJson.slice(0, -3);

            let parsedResult = JSON.parse(cleanJson);
            if (parsedResult.content) parsedResult = JSON.parse(parsedResult.content);

            const { rating, category } = parsedResult;

            // 2. Insert into Supabase with AI data
            await supabase
                .from('Posts')
                .insert({
                    title: post.title,
                    author: post.author,
                    description: post.description,
                    spiciness: rating,
                    category: category
                })
                .select();

            window.location = "/";
        } catch (error) {
            console.error("Failed to generate post:", error);
            setIsGenerating(false);
        }
    };

    // Render loading screen if AI is generating
    if (isGenerating) {
        return (
            <div className="loader-container">
                <div className="ai-spinner"></div>
                <h2>Analyzing Gen Z Slang... 🧠</h2>
                <p>Using AI to determine the spiciness rating and category.</p>
            </div>
        );
    }

    return (
        <div>
            <form onSubmit= {createPost}>
                <label htmlFor="title">Title</label> <br />
                <input type="text" id="title" name="title" onChange={handleChange} /><br />
                <br />
                <label htmlFor="author">Author</label><br />
                <input type="text" id="author" name="author" onChange={handleChange} /><br />
                <br />
                <label htmlFor="description">Description</label><br />
                <textarea rows="5" cols="50" id="description" name="description" onChange={handleChange}></textarea>
                <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default CreatePost