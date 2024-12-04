interface WelcomeSectionProps {
  username?: string;
}

export function WelcomeSection({ username }: WelcomeSectionProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold">Welcome back, {username}</h1>
        <p className="text-muted-foreground mt-1">
          Now we're logged in!
        </p>
      </div>
    </div>
  );
}
