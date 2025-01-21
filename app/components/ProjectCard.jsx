export default function ProjectCard({ title, description }) {
    return (
      <div className="w-full p-4 mb-4 border rounded-lg hover:border-gray-400 transition-colors">
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    );
  }