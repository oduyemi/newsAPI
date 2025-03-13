import NewsPost from "@/components/SingleNews";



export default function singleNews () {
 
    return(
        <div>
            <NewsPost
                title="Breaking: Tech Giants Announce AI Collaboration"
                image="/images/blog1.jpg"
                excerpt="Major technology firms have announced a groundbreaking partnership to develop next-generation artificial intelligence solutions..."
                link="/news/tech-giants-ai"
            />
        </div>
    )
}
