'use client'
import { useRouter } from "next/navigation";
import React from "react";

const DBSeekHowItWorks = () => {
    const router = useRouter();
  const steps = [
    {
      number: 1,
      title: "Upload Your Data",
      description:
        "Start by uploading your CSV file with a simple drag and drop. DBSeek will automatically analyze and index your data structure to prepare it for natural language queries.",
      icon: "📁",
    },
    {
      number: 2,
      title: "Ask Your Question",
      description:
        "Type your question in plain English, just as you would ask a colleague. For example, 'Show me sales by region for the last quarter' or 'Which products had the highest growth rate?'",
      icon: "💬",
    },
    {
      number: 3,
      title: "AI Translation",
      description:
        "Behind the scenes, DBSeek's AI translates your natural language question into an optimized SQL query designed specifically for your database structure.",
      icon: "⚙️",
    },
    {
      number: 4,
      title: "Explore Visualized Results",
      description:
        "Instantly see your results presented in interactive charts and graphs. DBSeek automatically selects the most appropriate visualization type based on your data and query.",
      icon: "📊",
    },
  ];

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        backgroundColor: "#000",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "4rem",
            animation: "fadeInUp 0.5s ease-out",
          }}
        >
          <h1 style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>
            How DBSeek Works
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#9ca3af",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            From natural language to powerful database insights in just a few
            simple steps
          </p>
        </div>

        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: "5rem",
                position: "relative",
                animation: "fadeIn 0.5s ease-out",
                animationFillMode: "both",
                animationDelay: `${(index + 1) * 0.1}s`,
                flexDirection: index % 2 === 0 ? "row" : "row-reverse",
              }}
            >
              <div
                style={{
                  width: "4rem",
                  height: "4rem",
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  flexShrink: 0,
                  zIndex: 10,
                  animation: "pulse 2s infinite",
                }}
              >
                {step.number}
              </div>

              <div
                style={{
                  backgroundColor: "#111827",
                  borderRadius: "0.5rem",
                  padding: "2rem",
                  margin: "0 1rem",
                  flexGrow: 1,
                  marginLeft: index % 2 === 0 ? "2rem" : "1rem",
                  marginRight: index % 2 === 1 ? "2rem" : "1rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    color: "#22c55e",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: "#9ca3af",
                    lineHeight: 1.6,
                    marginBottom: "1.5rem",
                  }}
                >
                  {step.description}
                </p>
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    backgroundColor: "#1f2937",
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                  }}
                >
                  {step.icon}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: "2rem",
                    top: "4rem",
                    height: "calc(100% - 3rem)",
                    width: "2px",
                    backgroundColor: "#374151",
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "4rem",
            animation: "fadeInUp 0.5s ease-out",
            animationDelay: "0.6s",
            animationFillMode: "both",
          }}
        >
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
            }}
          >
            Ready to interact with your data in a new way?
          </h3>
          <button
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1.125rem",
              borderRadius: "0.375rem",
              fontWeight: 500,
              cursor: "pointer",
              background: "#22c55e",
              color: "white",
              border: "none",
            }}
            onClick={() => router.push('/chat')}
          >
            Upload Your Database
          </button>
          <button
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1.125rem",
              borderRadius: "0.375rem",
              fontWeight: 500,
              cursor: "pointer",
              background: "transparent",
              color: "#22c55e",
              border: "1px solid #22c55e",
              marginLeft: "1rem",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#22c55e";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#22c55e";
            }}
            onClick={() => router.push('/chat')}
          >
            See Examples
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default DBSeekHowItWorks;