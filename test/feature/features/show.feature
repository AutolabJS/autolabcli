Feature: Show
  I should be able to see Autolab's status, labs and their scoreboards.

    Background:
    Given that the main server host is set from the file '../feature-prefs.json'

    Scenario: Show command to show server status
      Given I want to know the status of the main server
      When I run show command with status
      Then I should be dislayed the main server's status, with a maximum wait of 3.0 seconds
    
    Scenario: Show command to show scoreboard of a lab
      Given I want to know the scoreboard of 'lab2'
      When I run show command with score using 'flags'
      Then I should be dislayed the scoreboard, with a maximum wait of 5.0 seconds
    
    Scenario: Show command to show scoreboard of a lab
      Given I want to know the scoreboard of 'lab2'
      When I run show command with score using 'prompt'
      Then I should be dislayed the scoreboard, with a maximum wait of 5.0 seconds
    
    Scenario: Show command to show scoreboard of a lab
      Given I want to know the scoreboard of 'lab1000'
      When I run show command with score using 'flags'
      Then I should be dislayed error message for invalid lab, with a maximum wait of 5.0 seconds
    
    Scenario: Show command to show scoreboard of a lab
      Given I want to know the score of 'testuser1' in 'lab2'
      When I run show command with score using 'flags'
      Then I should be dislayed the scoreboard, with a maximum wait of 5.0 seconds
    