'use client'
import { useRouter } from "next/navigation";
import React from "react";

const DBSeekFeatures = () => {
    const router = useRouter();
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
            Powerful Features That Simplify Database Interaction
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#9ca3af",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            DBSeek translates natural language into SQL, making databases
            accessible to everyone
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "2.5rem",
          }}
        >
          {[
            {
              icon: "💬",
              title: "Natural Language Queries",
              description:
                "Ask complex questions in plain English. No need to learn SQL or database syntax - just type as you would speak.",
            },
            {
              icon: "🔄",
              title: "Instant SQL Translation",
              description:
                "Our AI instantly converts your natural language questions into optimized SQL queries behind the scenes.",
            },
            {
              icon: "📊",
              title: "Automatic Visualization",
              description:
                "Query results are automatically transformed into the most appropriate charts and graphs for insightful data exploration.",
            },
            {
              icon: "📁",
              title: "Simple Data Upload",
              description:
                "Import CSV files with a simple drag-and-drop. No complicated database setup or configuration required.",
            },
            {
              icon: "💡",
              title: "Suggested Queries",
              description:
                "Not sure what to ask? DBSeek analyzes your data structure and suggests relevant questions to help you get started.",
            },
            {
              icon: "📱",
              title: "Share & Export",
              description:
                "Export your visualizations or share interactive dashboards with teammates who need access to the insights.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#111827",
                borderRadius: "0.5rem",
                padding: "2rem",
                transition: "all 0.3s ease",
                animation: "fadeInUp 0.5s ease-out",
                animationFillMode: "both",
                animationDelay: `${(index + 1) * 0.1}s`,
              }}
              className="feature-card"
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#1f2937";
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#111827";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                  color: "#22c55e",
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.75rem",
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: "#9ca3af", lineHeight: 1.6 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "4rem",
            animation: "fadeInUp 0.5s ease-out",
            animationDelay: "0.5s",
            animationFillMode: "both",
          }}
        >
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
            Get Started Now
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
      `}</style>
    </div>
  );
};

export default DBSeekFeatures;