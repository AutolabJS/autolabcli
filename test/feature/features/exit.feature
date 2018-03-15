Feature: Exit
  I should logout of AutolabJS when I run exit command

  Scenario: Exit command
    Given I have already logged in
    When I run exit command
    Then My login credentials should be removed
