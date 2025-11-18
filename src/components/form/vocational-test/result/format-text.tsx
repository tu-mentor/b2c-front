import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/card";
interface TextFormatterProps {
  text: string;
}

export default function TextFormatter({ text }: TextFormatterProps) {
  const formatText = (text: string) => {
    // Dividir el texto en secciones
    const sections = text.split("###").map((section) => section.trim());

    return sections.map((section, index) => {
      if (index === 0) {
        const lines = section.split("\n");
        return (
          <Card key={index} className="mb-6">
            <CardContent className="pt-6">
              {lines.map((line, i) => {
                if (line.trim() === "") {
                  return <div key={i} className="h-4" />;
                }
                if (line.trim() === "---") {
                  return <hr key={i} className="my-4 border-t border-gray-200" />;
                }

                const formattedLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

                return (
                  <p
                    key={i}
                    className="text-muted-foreground mb-2"
                    dangerouslySetInnerHTML={{ __html: formattedLine }}
                  />
                );
              })}
            </CardContent>
          </Card>
        );
      }

      const [title, ...content] = section.split("\n");
      const formattedContent = content
        .join("\n")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
        .split("\n")
        .map((line, i) => {
          if (line.trim() === "---") {
            return <hr key={i} className="my-4 border-t border-gray-200" />;
          }

          if (line.startsWith("- ")) {
            return (
              <li
                key={i}
                className="ml-6 list-disc text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: line.substring(2) }}
              />
            );
          }
          return (
            <p
              key={i}
              className="text-muted-foreground mb-2"
              dangerouslySetInnerHTML={{ __html: line }}
            />
          );
        });

      return (
        <Card key={index} className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">{formattedContent}</div>
          </CardContent>
        </Card>
      );
    });
  };

  return <div className="max-w-4xl mx-auto p-4 space-y-4">{formatText(text)}</div>;
}
