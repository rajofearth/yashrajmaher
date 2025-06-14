const truncateText = (text, maxLength) => {
	if (!text) return "";
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength).trim() + "...";
};

export default truncateText;
