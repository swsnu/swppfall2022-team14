import { useParams } from "react-router"

export default function ItemDetailPage() {
    const { type, id } = useParams();

    return (
        <div className="ItemDetail">
            Item detail page
        </div>
    )
}